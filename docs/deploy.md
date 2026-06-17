# Deploy · Patrones del ecosistema PROESA

Las apps PROESA se despliegan en uno de tres entornos según el caso. Esta guía resume cuándo va cada uno y cómo se configura.

> Para el detalle de un caso específico (ports, paths, comandos exactos), ver el `DEPLOY.md` o `.github/workflows/deploy.yml` del repo de la app.

---

## Decisión: dónde desplegar

| Caso | Entorno |
|---|---|
| App interna LANS, datos sensibles, sin tráfico externo | **Servidor LANS 192.168.1.77** (PM2 + nginx + GitHub Actions self-hosted) |
| App con tráfico moderado, requiere SSL público, parte del paraguas Portal | **Servidor LANS** detrás del Portal Gateway |
| Landing / brochureware sin backend | **Cloudflare Pages** o **Netlify** |
| App SaaS de producto Medvana | **Azure App Services** (no es PROESA, otro ecosistema) |

**Regla:** apps PROESA **no** se despliegan en Azure. Azure es para Medvana.

---

## Servidor LANS 192.168.1.77

### Stack

| Componente | Uso |
|---|---|
| **PM2** | Process manager para Node.js y Python |
| **Nginx** | Reverse proxy, sirve frontends estáticos |
| **GitHub Actions self-hosted runner** | CI/CD preferido |
| **systemd** | Persistencia de PM2 entre reinicios |

### Estructura estándar

```
/opt/<nombre-app>/
├── backend/
│   ├── src/
│   ├── data/             # SQLite si aplica
│   ├── logs/
│   ├── .env              # Config (no commitear)
│   ├── ecosystem.config.cjs
│   └── package.json
├── frontend/
│   ├── src/
│   ├── dist/             # Build de producción (nginx sirve esto)
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```

### PM2 — un ecosystem por app

Cada app tiene su propio `ecosystem.config.cjs` en su propio directorio. **No existe un ecosystem central.**

Plantilla:

```js
// /opt/<nombre-app>/ecosystem.config.cjs
module.exports = {
  apps: [{
    name: '<nombre-app>',
    script: 'src/index.js',          // o './.venv/bin/uvicorn' para Python
    args: '',                         // ej: 'src.main:app --host 127.0.0.1 --port XXXX'
    cwd: '/opt/<nombre-app>/backend',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: { NODE_ENV: 'production', PORT: XXXX },
    error_file: '/var/log/pm2/<nombre-app>.err.log',
    out_file: '/var/log/pm2/<nombre-app>.out.log',
    merge_logs: true,
  }]
};
```

Comandos:

```bash
pm2 start /opt/<nombre-app>/ecosystem.config.cjs   # primera vez
pm2 restart <nombre-app>                           # después (workflow CI/CD)
pm2 reload <nombre-app>                            # reload sin downtime
pm2 logs <nombre-app>                              # ver logs
pm2 save                                           # persistir tras cambios
```

### Nginx — sites

- Directorio: `/etc/nginx/sites-available/`
- Activar: `ln -s /etc/nginx/sites-available/<app> /etc/nginx/sites-enabled/`
- Verificar: `nginx -t && systemctl reload nginx`

Patrón estándar:

```nginx
server {
    listen <PUERTO>;
    server_name _;

    location / {
        root /opt/<app>/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:<PUERTO_BACKEND>;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### GitHub Actions self-hosted runner

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  APP_DIR: /opt/<nombre-app>

jobs:
  deploy:
    runs-on: self-hosted
    steps:
      - name: Pull cambios
        working-directory: ${{ env.APP_DIR }}
        run: git fetch origin main && git reset --hard origin/main

      - name: Backend
        working-directory: ${{ env.APP_DIR }}/backend
        run: npm install --production

      - name: Frontend
        working-directory: ${{ env.APP_DIR }}/frontend
        run: npm install && npm run build

      - name: Reiniciar
        run: pm2 restart <app-name>
```

### Tabla de puertos en uso

Mantener actualizada al agregar una app nueva. Coordinar con el equipo del Portal Gateway si la app va detrás de él.

Backends (puertos `5xxx`) escuchan en `0.0.0.0` cuando viven detrás del nginx
del gateway-lans (`.15`); en `127.0.0.1` cuando hay nginx local del `.77` como
intermediario. Apartar el puerto incluso si la app aún no se ha deployado en
el `.77` — la reserva vale desde el momento en que entra al `ecosystem.config.cjs`.

| Puerto | Aplicación |
|---|---|
| 3001 | procesador-subrogados (backend) |
| 4500 | control-consumos (backend) |
| 4600 | control-coberturas (backend FastAPI, interno) |
| 5100 | lans-api (backend FastAPI) |
| 5200 | purchase-planning (backend FastAPI) |
| 5300 | proesa-gateway / portal (backend uvicorn, interno 127.0.0.1; expuesto vía nginx :443/:9443) |
| 5400 | gestion-costos (backend FastAPI, reservado en ecosystem aunque aún no deployado) |
| 5500 | control-cxp (backend FastAPI, sirve también el SPA; bind 0.0.0.0; nginx en .15 → pagos.grupoproesa.mx) |
| 5600 | gestion-logistica (backend FastAPI, sirve también el SPA; bind 0.0.0.0; nginx en .15 → logistica.grupoproesa.mx) |
| 8000 | labcore-api (FastAPI) |
| 8010 | procesador-subrogados (nginx) |
| 8011 | control-consumos (nginx) |
| 8020 | lans-api (nginx) |
| 8030 | purchase-planning (nginx) |
| 8040 | portal-informes (Node.js) |
| 9443 | nginx HTTPS del `.77` (legacy — control-coberturas + proesa-gateway aún lo exponen; nuevas apps usan `:443` directo del gateway-lans `.15`) |

**REGLAS:**
1. Al **desplegar** o **reservar** una app nueva, agregarla a esta tabla en el mismo PR.
2. Antes de tomar un puerto, **validar** que no esté en uso buscando:
   - Esta tabla del playbook.
   - `ecosystem.config.cjs` y `.env*` de otros repos PROESA (`grep -rln "PORT\|--port" /path/to/PROESA/*/`).
   - `ss -tlnp` en el `.77` para procesos vivos.
3. Patrón canónico: saltos de 100 en cada banda (`3xxx` apps Node, `4xxx`/`5xxx` apps FastAPI, `8xxx` nginx locales legacy).

---

## Cloudflare Pages / Netlify

Para landings sin backend o frontends estáticos.

### Cloudflare Pages
- Build command: `npm run build`
- Output: `dist/` (Vite) o `out/` (Astro static).
- Variables de entorno: en el dashboard CF.
- SSG nativo, JS=0 por default si se usa Astro.

### Netlify
- Para frontends con `Functions` (serverless).
- `netlify.toml` con `[functions] directory` relativo al `[build] base`.
- **Trampa:** `frontend/public/_redirects` con catch-all SPA mata las Functions. Usar solo `[[redirects]]` en `netlify.toml`.
- Trigger deploy con "Clear cache and deploy site" después de cambiar env vars.
- Propagación CDN puede tardar hasta 20 minutos post-deploy.

---

## Checklist pre-deploy

Antes del primer deploy de una app nueva:

- [ ] `DEPLOY.md` con instrucciones específicas en el repo.
- [ ] `.env.production` template completo (NO commitear el real).
- [ ] `.github/workflows/deploy.yml` con job `runs-on: self-hosted` (LANS) o `ubuntu-latest` (Pages/Netlify).
- [ ] Setup inicial manual en servidor: clonar repo, crear `.env`, configurar nginx, `pm2 start ecosystem`.
- [ ] Coordinación con equipo del Portal Gateway: registrar app en `config/apps.yml`, definir roles y match_type.
- [ ] Smoke test end-to-end: login real desde Portal → flujos críticos → logout.
- [ ] Tabla de puertos actualizada en este documento.
- [ ] Cookie `<app>_session` configurada con `Secure`, `HttpOnly`, `Domain=.grupoproesa.mx`.

---

## Coordinación con Portal Gateway

Cuando una app va detrás del Portal Gateway:

1. Equipo de la app indica al equipo del Gateway:
   - Nombre canónico de la app (slug).
   - Puerto interno (ej. 4600).
   - Roles esperados (lista de strings).
   - `match_type` de las reglas de acceso (`area`, `area_ruta`, etc.).
2. Equipo del Gateway agrega la app a `config/apps.yml` como `integrated`.
3. Equipo de la app verifica:
   - JWT del Portal valida contra JWKS público.
   - Cookie se emite correctamente.
   - `<PortalChip/>` apunta al `VITE_PORTAL_URL` correcto.
4. Smoke test conjunto antes de anunciar.
