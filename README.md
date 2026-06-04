# @proesa/design

Sistema de diseño del ecosistema PROESA. Tokens, componentes React y patrones para que toda mini-app que vive detrás del **Portal PROESA** se vea, suene y se sienta como parte del mismo producto.

> **Audiencia primaria:** Claude Code construyendo apps PROESA.
> **Audiencia secundaria:** humanos del equipo de plataforma.

## Cómo se usa

> **¿Vas a usarlo con Claude Code?** Empieza por [USE_ME.md](./USE_ME.md) — guía
> práctica y compartible para crear una app desde cero o adaptar una existente,
> con los prompts de arranque listos para copiar.

### Apps nuevas (stack canónico Vite + React + TS + Tailwind v4)

```bash
npm i github:Grupo-PROESA/proesa-design-system
```

```css
/* src/index.css */
@import "tailwindcss";
@import "@proesa/design/tokens";
@import "@proesa/design/preset";
```

```tsx
import { Layout, AuthProvider, ProtectedRoute, Button, Card, KpiCard } from "@proesa/design";
```

Para arrancar una app desde cero, lee [BOOTSTRAP.md](./BOOTSTRAP.md) — está escrito para que un agente lo siga sin fricción.

### Apps existentes (look & feel only, sin cambiar de stack)

```css
/* index.css de la app — sirve para Antd, Refine, vanilla CSS, lo que sea */
@import "node_modules/@proesa/design/tokens/proesa.css";
```

Ahora la app puede usar `var(--proesa-navy-700)`, `var(--proesa-teal-600)`, etc. Para alinear el look paso a paso, lee [MIGRATION.md](./MIGRATION.md).

## Estructura

| Carpeta | Propósito |
|---|---|
| `tokens/` | CSS vars puras. Consumibles por cualquier stack. |
| `src/` | Paquete TypeScript: componentes, hooks, utils, preset Tailwind. |
| `docs/` | Documentación canónica del patrón UI, voz, iconografía, auth, deploy. |
| `references/` | Histórico: mockups originales y versiones previas del UI-PATTERN. Read-only. |

## Documentación

- [USE_ME.md](./USE_ME.md) — Guía práctica para usar el design system con Claude Code (crear app nueva o adaptar existente).
- [docs/ui-pattern.md](./docs/ui-pattern.md) — Patrón UI canónico.
- [docs/voice-and-tone.md](./docs/voice-and-tone.md) — Microcopy en español MX.
- [docs/iconography.md](./docs/iconography.md) — Lucide curado y convenciones.
- [docs/auth-and-sso.md](./docs/auth-and-sso.md) — Integración con `proesa-gateway`.
- [docs/deploy.md](./docs/deploy.md) — Patrones de despliegue.
- [BOOTSTRAP.md](./BOOTSTRAP.md) — Crear app PROESA nueva desde cero.
- [MIGRATION.md](./MIGRATION.md) — Alinear app existente al ecosistema.
- [CHANGELOG.md](./CHANGELOG.md) — Historial de versiones.

## Versionado

`@proesa/design` sigue [SemVer](https://semver.org/lang/es/). En `0.x.x` cualquier cambio puede ser breaking; a partir de `1.0.0` solo los `MAJOR` rompen contrato.

Apps consumidoras pueden pinear vía git tag:

```bash
npm i github:Grupo-PROESA/proesa-design-system#v0.1.0
```

## Mantenimiento

Equipo de plataforma PROESA. Cambios al patrón UI se discuten primero en `docs/adr/` antes de tocar componentes.
