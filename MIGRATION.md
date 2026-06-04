# MIGRATION — Alinear app existente al ecosistema PROESA

Este documento es para **Claude Code** (o cualquier agente) que recibe la tarea "alinea esta app existente al look&feel de PROESA, sin cambiarle el stack".

> **Aplica a:** ControlConsumos (sin Tailwind v4), SED-PROESA (Refine + Antd), apps con stack legacy, o cualquier app que ya está productiva y migrar el stack es trabajo de meses.
>
> **No aplica a:** apps nuevas. Para apps nuevas, ver `BOOTSTRAP.md`.

---

## 0. Antes de empezar

Confirma con el usuario:

1. **¿Estamos seguros de no migrar el stack?** Si la app es chiquita y el stack legacy duele, vale la pena considerar migrar al canónico (Vite + React + TS + Tailwind v4) en vez de hacer dos pases.
2. **Alcance del look&feel migration**: ¿solo brand colors? ¿también sidebar y header? ¿KPIs? Definir ANTES de tocar.
3. **Branch separado**: NUNCA migrar look&feel directo en `main`/`dev`. Usar `feature/proesa-design-alignment` o similar.

---

## 1. Filosofía

**La firma visual no es negociable** sin importar el stack:

- Sidebar **navy-900** con secciones y brand mark gradient navy→teal.
- Header con **PortalChip** + título.
- Cards `rounded-xl border-gray-200 shadow-sm`.
- Tipografía **Source Sans 3**.
- Tokens PROESA en `:root`.

Lo que **sí** es negociable:

- React 18 vs React 17.
- TypeScript vs JSX puro.
- Tailwind v4 vs Tailwind v3 vs CSS modules.
- react-router v7 vs v6.
- Antd / Refine / shadcn / componentes propios.

---

## 2. Inventario inicial

Antes de tocar:

1. Buscar todos los `emerald-*`, `green-*`, `purple-*`, `pink-*`, `orange-*` que NO sean semánticos. Hacer una lista. Clasificar cada uno:
   - **Brand** (botón primario, focus ring, sidebar activo, login mark, links primarios) → cambiar a tokens PROESA.
   - **Semántico** (estado "ok", "pagado", "al corriente", success toast, dot de aging "corriente", check de validación) → mantener.
   - **Indeterminado** → llevar a revisión, decidir caso por caso.
2. Buscar todos los `slate-*`, `blue-*` en superficies de chrome (sidebar, header, login). Clasificar igual.
3. Identificar los lugares donde se carga la fuente (puede ser Inter, Roboto, system-ui, etc.).
4. Identificar el sidebar y header actuales (ubicación de archivos).
5. Identificar el login.

Documentar el inventario en `.claude/docs/proesa-migration-inventory.md` antes de tocar código.

---

## 3. Paso 1 — Importar tokens

Instalar el paquete:

```bash
npm i github:Grupo-PROESA/proesa-design-system
```

Importar **solo** los tokens en el CSS principal de la app:

```css
/* Para Tailwind v3 / CSS modules / vanilla */
@import "node_modules/@proesa/design/tokens/proesa.css";
```

Si la app es Tailwind v3 con `tailwind.config.js`, agregar:

```js
theme: {
  extend: {
    colors: {
      "proesa-navy": {
        50: "#F2F7FC",
        100: "#E3EEF8",
        200: "#BFDBF1",
        300: "#8CC4EA",
        500: "#4B86C7",
        700: "#204590",
        800: "#1B3373",
        900: "#14275A",
      },
      "proesa-teal": {
        100: "#E2F2EC",
        300: "#7BC4B0",
        500: "#41B292",
        600: "#37A992",
        700: "#2C8A7A",
        900: "#1F6056",
      },
    },
    fontFamily: {
      sans: ["Source Sans 3", "Calibri", "Segoe UI", "system-ui", "sans-serif"],
    },
  },
}
```

Para apps **sin** sistema de tokens (vanilla CSS), basta con `@import` y usar `var(--proesa-navy-700)` directamente.

---

## 4. Paso 2 — Tipografía

Cargar Source Sans 3 en `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Aplicar al body:

```css
body {
  font-family: "Source Sans 3", "Calibri", "Segoe UI", system-ui, sans-serif;
  font-feature-settings: "tnum" 1;
}
```

---

## 5. Paso 3 — Login

Es la primera impresión. Rehacer del todo:

- Fondo: gradient `from-[#14275A] via-[#1B3373] to-[#1F6056]` con `backgroundImage:` longhand.
- Card centrada `rounded-2xl shadow-xl bg-white max-w-md p-8`.
- Brand mark con `var(--proesa-brand-gradient)`.
- Botón primario `bg-[#204590] hover:bg-[#1B3373]`.

Si la app está en stack canónico, importar `<LoginPage>` del paquete:

```tsx
import { LoginPage } from "@proesa/design";
```

Si no, replicarlo a mano siguiendo el patrón de `docs/ui-pattern.md` §7.

---

## 6. Paso 4 — Sidebar

Cambios obligatorios (en este orden):

1. Background a `var(--proesa-navy-900)`. Si era `bg-slate-950`: swap directo. Si era blanco o color marca: cambio mayor, tomar paciencia.
2. Item activo a `var(--proesa-navy-700)` con `text-white` y sombra navy.
3. Brand mark del sidebar: cuadrado `w-8 h-8 rounded-lg` con `var(--proesa-brand-gradient)` y `box-shadow: var(--proesa-shadow-brand)`. Icono Lucide del dominio (ver `docs/iconography.md`).
4. Texto del brand: `text-white text-sm font-bold tracking-tight` + `PROESA` en `text-[11px]` con `color: var(--proesa-navy-300)`.
5. Footer: quitar nombre interno (departamento, marca local). Poner `PROESA · {App}` + versión.
6. Si tiene 5+ rutas, agruparlas en secciones con eyebrow `text-[10px] uppercase tracking-wider text-slate-500`.

---

## 7. Paso 5 — Header con PortalChip

Si el header actual:

- No tiene "Volver al Portal" → agregarlo como `<PortalChip/>` o replicado a mano.
- Tiene una flecha + texto plano "← Portal PROESA" → reemplazar por la pill canónica (avatar + caret + "Portal").
- Tiene la app metida en pantalla completa sin chrome PROESA → discutir con el usuario, puede ser que la app no quepa en el ecosistema.

`<PortalChip/>` HTML/CSS canónico está en `tokens/proesa.css` (clase `.portal-chip`). Cualquier stack puede usarlo:

```html
<a href="https://portal.grupoproesa.mx:9443" title="Volver al Portal PROESA" class="portal-chip">
  <span class="portal-chip__avatar">P</span>
  <svg class="portal-chip__back"><!-- chevron-left 12px --></svg>
  <span>Portal</span>
</a>
```

Avatar de usuario: gradient navy→teal en círculo. Si era de otro color (azul Tailwind crudo, gris, etc.): swap.

---

## 8. Paso 6 — Cards

Estandarizar a `rounded-xl border-gray-200 shadow-sm`. Eliminar variantes:

- ❌ `rounded-2xl shadow-xl` (excepto Login y modales).
- ❌ Borde de acento de color (`border-blue-500`, `border-l-4 border-emerald-500` excepto en `AlertaCard`).
- ❌ Drop shadow multicolor.

Cards header: `border-b border-gray-100`, título `text-base font-semibold text-gray-900`.

---

## 9. Paso 7 — Botones

Primary: navy-700 con hover navy-800.

```css
.btn-primary {
  background: var(--proesa-navy-700);
  color: #fff;
}
.btn-primary:hover { background: var(--proesa-navy-800); }
```

Si la app usa Antd: customizar el `theme.token.colorPrimary` en `ConfigProvider`:

```tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: "#204590",
      colorPrimaryHover: "#1B3373",
      borderRadius: 8,
      borderRadiusLG: 12,
      fontFamily: "Source Sans 3, Calibri, Segoe UI, system-ui, sans-serif",
    },
  }}
>
```

Esto cambia globalmente botones, links, focus, switches, etc. en Antd.

Si la app usa Refine: lo mismo, vía `RefineThemes` o `ConfigProvider`.

---

## 10. Paso 8 — KPIs

Si la app tiene KpiCards:

- Tone `blue` (border / bg / text): `#BFDBF1 / #F2F7FC / #204590`.
- Tone `blue-strong`: `#8CC4EA / #E3EEF8 / #14275A`.
- Tonos semánticos (verde/amber/red): **no migran**, se mantienen Tailwind nativo.

Si no tiene KpiCards y son apps de cartera/financiera: considerar agregarlos siguiendo §6 de `ui-pattern.md`.

---

## 11. Paso 9 — Tablas

Cambios mínimos:

- Header: `bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider`.
- Filas: `hover:bg-gray-50`, `border-b border-gray-100`.
- Numéricos: `font-mono tabular-nums`.

Si es tabla financiera: ver `docs/ui-pattern.md` §6 "Reglas para tablas financieras".

---

## 12. Casos especiales

### Antd

Configurar el theme en `ConfigProvider`. La mayoría del visual brand se controla desde ahí. Lo que NO se puede customizar (alguna sombra muy específica, algún spacing):

- O se acepta que la app no es 100% pixel-perfect con las apps canónicas.
- O se override con CSS custom dentro del `<body>` de la app.

### Refine

Igual que Antd. Refine usa Antd debajo, así que el mismo `ConfigProvider` funciona.

### CSS modules / styled-components

Sustituir hex hardcodeados por `var(--proesa-navy-*)`. Donde había gradients custom, usar `var(--proesa-brand-gradient)`.

### JSX puro sin TypeScript

Sin problema. Los tokens son CSS, no requieren TS. El paquete `@proesa/design` se puede instalar pero NO se importan los componentes React (que están en TS strict). Solo se usan los tokens y la clase `.portal-chip`.

---

## 13. Checklist de migración completa

- [ ] Tokens PROESA importados en CSS.
- [ ] Source Sans 3 cargada y aplicada al body.
- [ ] Login con gradient navy-900 → teal-900.
- [ ] Sidebar background `var(--proesa-navy-900)`.
- [ ] Sidebar item activo `var(--proesa-navy-700)`.
- [ ] Brand mark del sidebar usa el gradient PROESA + icono Lucide del dominio.
- [ ] Sidebar footer dice `PROESA · {App}` + versión.
- [ ] Header tiene PortalChip como primer elemento.
- [ ] Avatar de usuario usa gradient navy→teal.
- [ ] Botón primario es navy-700, hover navy-800.
- [ ] Cards `rounded-xl border-gray-200 shadow-sm`.
- [ ] KPIs usan los hex PROESA en tonos azules.
- [ ] Inventario de colores migrados está documentado en `.claude/docs/proesa-migration-inventory.md`.
- [ ] Tonos semánticos (verde/amber/red) NO se tocaron.
- [ ] Smoke test visual: la app se ve hermana de las canónicas (ControlCoberturas, PurchasePlanning, gateway).

---

## 14. Lo que NO entra en este pase

**No tocar en migración de look&feel:**

- Lógica de negocio.
- Schemas de API.
- Nombres de rutas.
- Contratos de componentes.
- Permisos / roles.
- Integraciones externas.

Si descubres bugs o mejoras durante la migración, documéntalos en issues separados. La migración debe poder mergearse sin tocar funcionalidad.
