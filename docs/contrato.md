# Contrato de integración · proesa-design-system

Lo que esta librería ofrece a otras apps PROESA. Es la fuente de verdad: si cambian los `exports` de
`package.json` o la API pública de `src/index.ts`, este archivo cambia en el mismo PR.

- **Dueño de la app:** Dirección (@r-tapia22), mientras se asigna especialista (a quien se le piden cambios)

Esta librería no ofrece endpoints ni API HTTP: no es un servicio, no se despliega y no corre en
ningún servidor. Se consume como dependencia de npm instalada desde GitHub, fijada a un tag. Si
necesitas un componente o un cambio, pídelo con un issue `cross-repo` a su dueño (ver
`13-integraciones.md` del playbook).

## Qué datos tiene esta app

| Dato | Descripción |
|---|---|
| Ninguno | Es una librería de componentes y estilos. No guarda datos ni tiene base de datos. |

## Cómo se consume

Dependencia en el `package.json` del frontend de la app, siempre con tag (versión vigente `v0.2.1`):

```json
"@proesa/design": "github:Grupo-PROESA/proesa-design-system#v0.2.1"
```

Entradas públicas (`exports` de `package.json`):

| Import | Qué trae |
|---|---|
| `@proesa/design` | Todo lo público (`src/index.ts`) |
| `@proesa/design/tokens` | Variables CSS de marca (`tokens/proesa.css`), sirve para cualquier stack |
| `@proesa/design/preset` | Preset de Tailwind v4 (`src/preset.css`) |
| `@proesa/design/components` (y `/layout`, `/ui`, `/data`, `/notifications`, `/domain`) | Componentes React |
| `@proesa/design/auth` | `AuthProvider`, `useAuth`, `ProtectedRoute`, `LoginPage` |
| `@proesa/design/hooks`, `/utils`, `/icons`, `/pages` | Hooks, utilidades, íconos curados y plantilla de página |

Requisitos de la app: `react` y `react-dom` 18 o 19, `react-router-dom` 6 o 7 y `lucide-react`
(`peerDependencies`). Con Tailwind v4, el `index.css` de la app necesita un `@source` que apunte a
`node_modules/@proesa/design/src` para que se generen las clases de los componentes.

`AuthProvider` espera que el backend de la app exponga `GET /api/auth/me` y `POST /api/auth/logout`
(y `POST /api/auth/login` solo en desarrollo local), y redirige al portal
(`/apps/{appCode}/launch`) cuando la app responde `401`.

## Quién consume esta librería

| App | Versión | Desde |
|---|---|---|
| `plantilla-microapp` | `v0.2.1` | `frontend/package.json` |
| `control-cxp` | `v0.2.1` | `frontend/package.json` |
| `Cotizador` | `v0.2.1` | `frontend/package.json` |
| `gestor-personal` | `v0.2.1` | `frontend/package.json` |
| `ProcesadorSubrogados` | `v0.2.1` | `frontend/package.json` |
| `gestion-costos` | `v0.2.0` | `frontend/package.json` |
| `GestionLogistica` | `v0.2.0` | `frontends/{admin,enlace,recolector,vigilancia}/package.json` |
| `control-coberturas` | sin tag, repo viejo `r-tapia22/proesa-design-system` | `frontend/package.json` |
| `agentes-telefonicos` | sin tag, repo viejo `r-tapia22/proesa-design-system` | `workspace/package.json` |

## Cambios

- **Agregar** componentes o props opcionales: versión `PATCH` o `MINOR`, se anota en `CHANGELOG.md`.
- **Quitar, renombrar o cambiar** algo existente: rompe a quien lo usa. Mientras la versión sea
  `0.x`, sube el `MINOR`, se anota en `CHANGELOG.md` y se avisa a cada consumidor con un issue
  `cross-repo` en su repo. Las apps siguen en su tag hasta que migren.

| Fecha | Cambio |
|---|---|
| 2026-10-12 | Versión inicial de la tarjeta |
