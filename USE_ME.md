# use_me — Cómo usar @proesa/design

Guía práctica para construir o adaptar una aplicación web del ecosistema PROESA usando nuestro sistema de diseño (`@proesa/design`).
Esta guía está pensada principalmente para un proceso de desarrollo vía **agentic coding**.

---

## Antes que nada

`@proesa/design` es un repo **público** (`Grupo-PROESA/proesa-design-system`), así
que se instala directo con `npm`, sin claves SSH ni tokens. Cualquier máquina
con acceso a internet puede hacerlo. Si quieres confirmar que responde:

```bash
npm i github:Grupo-PROESA/proesa-design-system
# Para fijar la versión publicada (tag git v0.1.0):
# npm i github:Grupo-PROESA/proesa-design-system#v0.1.0
```

---

## La regla de oro

Toda app PROESA debe verse, sonar y sentirse como parte del mismo producto.
`@proesa/design` es la **única fuente de verdad** de UI: tokens, componentes y
patrón. No se reinventa el layout, los colores ni el copy.

Hay dos caminos. Elige según tu caso:

| Tu caso | Camino | Documento canónico |
|---|---|---|
| App **nueva** desde cero | Stack canónico + paquete completo | `BOOTSTRAP.md` |
| App **existente** que no cambia de stack | Solo tokens + alineación visual | `MIGRATION.md` |

---

# A. Crear una app desde cero

**Stack canónico:** Vite + React 18 + TypeScript strict + Tailwind v4 + lucide-react + react-router-dom v6+.

### Paso 1 — El prompt de arranque

Cópiale esto a Claude Code o el coding agent de tu preferencia:

> Voy a crear una app del ecosistema PROESA. Usa el sistema de diseño
> `@proesa/design` (`github:Grupo-PROESA/proesa-design-system`) como única fuente
> de verdad de UI. **Primero instala el paquete y lee su `BOOTSTRAP.md`
> completo; luego síguelo paso a paso** para el scaffolding. No inventes layout
> ni estilos: usa los componentes y tokens del paquete. Antes de generar
> archivos, pregúntame los datos de la sección 0 de `BOOTSTRAP.md` (nombre de la
> app, nombre visible, dominio, roles, puerto, si vive detrás del Portal).

### Paso 2 — Instalar

```bash
npm i github:Grupo-PROESA/proesa-design-system
# Para fijar versión estable:
# npm i github:Grupo-PROESA/proesa-design-system#v0.1.0
```

### Paso 3 — Las 3 líneas de CSS (en `src/index.css`)

```css
@import "tailwindcss";
@import "@proesa/design/tokens";
@import "@proesa/design/preset";
```

> Exactamente tres imports. **No** añadir reset propio, **no** redefinir
> variables, **no** sobreescribir el preset. Estilos custom van al final con
> `@layer utilities` o como CSS modules en componentes.

### Paso 4 — Usar los componentes que ya existen

```tsx
import {
  Layout, AuthProvider, ProtectedRoute, useAuth,
  LoginPage, DashboardTemplate,
  Button, Card, KpiCard,
} from "@proesa/design";
```

`BOOTSTRAP.md` trae listos: `App.tsx` con login/SSO y rutas protegidas,
`Dashboard.tsx` con KPIs por rol, `navConfig.ts`, `api.ts`, `.env.example`,
backend mínimo y workflow de deploy.

### Paso 5 — Verificar

Al terminar, Claude Code debe correr el **Smoke test final** (§16 de
`BOOTSTRAP.md`) y la **Checklist de "se ve PROESA"** de `docs/ui-pattern.md`:
sidebar navy-900, brand mark con gradient navy→teal, PortalChip en el header,
secciones filtradas por rol, KPIs según rol activo.

### Si la app NO puede usar el stack canónico

Lee la sección final de `BOOTSTRAP.md` ("Salirse del stack canónico"): se
importan **solo los tokens** y se replican a mano las piezas de chrome. En ese
caso, en realidad estás en el camino B.

---

# B. Adaptar una app existente

Para apps ya productivas donde **migrar el stack es trabajo de meses** (Antd, Refine, Tailwind v3, JSX puro, CSS modules…). Solo se adopta el look & feel.

### Paso 1 — El prompt de arranque

Cópiale esto a Claude Code:

> Esta app ya existe y NO quiero cambiarle el stack. Quiero alinearla
> visualmente al ecosistema PROESA con `@proesa/design`. **Lee su `MIGRATION.md`
> completo y síguelo paso a paso.** Instala solo los tokens, levanta primero el
> inventario de colores (sección 2) y trabaja en un branch separado. No toques
> lógica de negocio, schemas, rutas ni permisos.

### Paso 2 — Instalar e importar SOLO los tokens

```bash
npm i github:Grupo-PROESA/proesa-design-system
```

```css
/* CSS principal de la app — sirve para Antd, Refine, Tailwind v3, vanilla */
@import "node_modules/@proesa/design/tokens/proesa.css";
```

Ahora la app puede usar `var(--proesa-navy-700)`, `var(--proesa-teal-600)`, etc.

### Paso 3 — Levantar inventario antes de tocar nada

`MIGRATION.md` §2 pide listar los colores actuales y clasificarlos:

- **Brand** (botón primario, sidebar activo, focus, login) → cambiar a tokens PROESA.
- **Semántico** (ok/pagado/success, dot de aging, check) → **se mantiene**.
- **Indeterminado** → decidir caso por caso.

El inventario se documenta en `.claude/docs/proesa-migration-inventory.md`.

### Paso 4 — Aplicar la firma visual (orden de `MIGRATION.md`)

1. Tipografía Source Sans 3 cargada y aplicada al body.
2. Login con gradient navy-900 → teal-900.
3. Sidebar `var(--proesa-navy-900)`, item activo `var(--proesa-navy-700)`.
4. Brand mark con gradient PROESA + icono Lucide del dominio.
5. Header con `PortalChip` como primer elemento (clase `.portal-chip` está en `tokens/proesa.css`).
6. Cards `rounded-xl border-gray-200 shadow-sm`.
7. Botón primario navy-700, hover navy-800.

**Atajos por framework:**
- **Antd / Refine:** casi todo se controla desde `ConfigProvider` →
  `colorPrimary: "#204590"`, `colorPrimaryHover: "#1B3373"`, `borderRadius: 8`,
  `fontFamily: "Source Sans 3, …"`.
- **Tailwind v3:** extender `theme.colors` con la paleta `proesa-navy`/`proesa-teal`
  (snippet en `MIGRATION.md` §3).
- **CSS modules / styled-components:** sustituir hex hardcodeados por `var(--proesa-*)`.
- **JSX puro sin TS:** solo tokens y la clase `.portal-chip`; no se importan los componentes React.

### Paso 5 — Verificar

Usa la **Checklist de migración completa** (`MIGRATION.md` §13). Lo crítico:
los tonos semánticos (verde/amber/red) **no se tocan**, y la app debe quedar
"hermana" de las canónicas (ControlCoberturas, PurchasePlanning, gateway).

---

## Lo que NO se hace (en ambos caminos)

- ❌ Reinventar layout, sidebar, header, colores o copy.
- ❌ Mezclar `@proesa/design` con otro sistema de UI (p. ej. Antd Layout +
  `<Layout>` del paquete). O todo el sistema, o solo tokens.
- ❌ Redefinir o sobreescribir las variables de los tokens.
- ❌ En migración: tocar lógica de negocio, schemas, rutas, permisos o integraciones.
- ❌ Texto visible al usuario sin acentos. Todo el copy en **español MX correcto**
  (ver `docs/voice-and-tone.md`).

---

## Documentación de referencia

| Documento | Para qué |
|---|---|
| `BOOTSTRAP.md` | Crear app nueva, paso a paso (camino A). |
| `MIGRATION.md` | Alinear app existente sin cambiar stack (camino B). |
| `docs/ui-pattern.md` | Patrón visual canónico. La fuente de verdad del "se ve PROESA". |
| `docs/voice-and-tone.md` | Microcopy en español MX. |
| `docs/iconography.md` | Íconos Lucide curados y convenciones. |
| `docs/auth-and-sso.md` | Integración con el Portal/Gateway PROESA. |
| `docs/deploy.md` | Patrones de despliegue y puertos. |

---

## Plantilla de `CLAUDE.md` (o 'AGENTS.md') para la app consumidora

Para que Claude Code recuerde estas reglas en cada sesión, deja un `CLAUDE.md` en la raíz de tu app con algo como:

```md

## Sistema de diseño — OBLIGATORIO
Esta app pertenece al ecosistema PROESA y usa `@proesa/design` como única fuente
de verdad de UI. Antes de escribir UI, lee en node_modules/@proesa/design:
BOOTSTRAP.md (o MIGRATION.md si es app existente), docs/ui-pattern.md y
docs/voice-and-tone.md.

## Reglas que no se rompen
- Stack canónico: Vite + React 18 + TS strict + Tailwind v4 (apps nuevas).
- src/index.css = exactamente 3 imports (tailwindcss, tokens, preset). Nada más.
- Usar los componentes existentes. No reinventar layout, sidebar, colores ni copy.
- No mezclar @proesa/design con otro sistema de UI. O todo, o solo tokens.
- Todo el texto visible en español MX con acentos correctos.
```
