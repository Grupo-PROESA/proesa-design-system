# CLAUDE.md · proesa-design-system

> Esta app sigue el Playbook de Soluciones Digitales PROESA (instalado en ~/.claude/proesa-playbook/). Aquí va solo lo específico de esta app.

## Qué es

- **Proceso que resuelve:** que todas las apps PROESA se vean y se comporten igual. Es la librería
  `@proesa/design`: tokens de color y tipografía, preset de Tailwind, componentes React (layout,
  tablas, KPIs, notificaciones, ayuda) y el `AuthProvider` que conecta cada app con el portal.
- **Área dueña / dueño del proceso:** Dirección (@r-tapia22), mientras se asigna especialista.
- **Especialista responsable:** [completar]
- **Código en el portal (`appCode`):** no aplica. Es una librería, no se despliega ni tiene tile.
- **Versión vigente:** `0.2.1` (`package.json`, tag `v0.2.1`).

## Stack y cómo se usa

- TypeScript + React (peer: `react` y `react-dom` 18 o 19, `react-router-dom` 6 o 7, `lucide-react`).
- Se publica como código fuente: `exports` de `package.json` apunta a `src/` y `tokens/`. No hay
  paso de build ni scripts en `package.json`.
- Las apps lo instalan desde GitHub fijando un tag:

```bash
npm i github:Grupo-PROESA/proesa-design-system#v0.2.1
```

```css
/* src/index.css de la app */
@import "tailwindcss";
@import "@proesa/design/tokens";
@import "@proesa/design/preset";
```


## Roles

No define roles. `AuthProvider` expone `hasRole` y `hasAnyRole` para que cada app revise los roles
que le entrega el portal.

## Reglas de negocio clave

- Versionado SemVer con tags `vX.Y.Z` y `CHANGELOG.md` (`README.md`). En `0.x` cualquier cambio
  puede romper a las apps, por eso se fija el tag.
- `AuthProvider`: ante un `401` manda al usuario a `${portalUrl}/apps/${appCode}/launch` si la app
  pasa `appCode`. Sin `appCode` cae en `${portalUrl}/launch`, que el portal no tiene
  (`src/components/auth/AuthContext.tsx`, `BOOTSTRAP.md`).
- `VITE_DEV_LOCAL_LOGIN=true` activa el login local de `LoginPage`, solo para desarrollo.

## Integraciones

Esta librería no ofrece API ni guarda datos: el detalle de cómo se consume está en
`docs/contrato.md`. Lo que **consume** en tiempo de ejecución, desde el navegador de cada app:

| Necesito | De qué app (su `docs/contrato.md`) | Endpoint |
|---|---|---|
| Mandar al usuario a iniciar sesión | `proesa-gateway` | `GET /apps/{code}/launch` |
| Cerrar sesión del portal | `proesa-gateway` | `/auth/logout` (navegación, ver deuda) |
| Sesión de la propia app | backend de cada app | `/api/auth/me`, `/api/auth/logout` y similares |

## Dónde va cada cosa

- Tokens CSS: `tokens/proesa.css`. Preset de Tailwind: `src/preset.css`.
- Componentes: `src/components/<grupo>/` (`layout`, `ui`, `data`, `notifications`, `domain`,
  `auth`) y su `index.ts`. Todo lo público se exporta desde `src/index.ts`.
- Hooks: `src/hooks/`. Utilidades (cliente de API, fechas, dinero): `src/utils/`. Íconos curados:
  `src/icons/`. Plantilla de página: `src/pages/`.
- Documentación del patrón: `docs/` (UI, voz y tono, iconografía, auth, deploy). Guías:
  `BOOTSTRAP.md` (app nueva), `MIGRATION.md` (app existente), `USE_ME.md`.
- `references/`: mockups históricos, solo lectura.
- Cambio publicado: nueva entrada en `CHANGELOG.md`, `version` en `package.json` y tag nuevo.

## Excepciones al playbook

- Es una librería de frontend: no tiene backend, base de datos, health ni CD.

## Deuda conocida

- Sin CI: no hay `.github/workflows/`, nada revisa tipos en los PR.
- `README.md` sugiere instalar sin tag (`npm i github:Grupo-PROESA/proesa-design-system`).
- `BOOTSTRAP.md`, `README.md`, `MIGRATION.md` y `USE_ME.md` no mencionan la directiva `@source`
  que necesitan las apps con Tailwind v4 para incluir las clases de estos componentes.
- `docs/auth-and-sso.md` usa la URL del portal con puerto `:9443`. `proesa-gateway` hoy usa
  `https://portal.grupoproesa.mx` sin puerto.
- `logout()` navega con `GET` a `${portalUrl}/auth/logout`, pero el portal solo define
  `POST /auth/logout`.
- `README.md` dice que los cambios al patrón se discuten en `docs/adr/`, carpeta que no existe.
