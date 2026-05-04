# Patrón UI · Mini-apps del Ecosistema PROESA

> Guía canónica para que toda mini-app interna del portal PROESA se vea, suene y se sienta como parte del mismo ecosistema, aunque cada una resuelva un problema distinto.
>
> **Cómo usarla con Claude Code:** copia este archivo a la raíz del repo de cualquier mini-app nueva (como `UI-PATTERN.md` o pégalo dentro de `CLAUDE.md`). La guía está escrita para ser leída por agentes y por humanos.

---

## 0. Identidad del ecosistema en una línea

Cada mini-app es **una herramienta interna seria, calmada y eficiente** que vive dentro de un portal corporativo de salud. La voz es **institucional-cálida**, los colores son **navy + teal sobre blanco-clínico**, y la tipografía es **una sola sans-serif limpia** (Source Sans 3 / Calibri fallback). Sin emoji, sin gradientes barrocos, sin animaciones efusivas.

Si dudas, pregúntate: *¿esta UI se ve bien junto a un reporte de laboratorio impreso?* Si la respuesta es no, retrocede.

---

## 1. Stack obligatorio

| Capa | Elección | Notas |
|---|---|---|
| Framework | **React 19 + Vite + TypeScript strict** | Sin Next, sin SSR. SPA pura. |
| Estilos | **Tailwind 4** + tokens del design system PROESA | No CSS-in-JS, no styled-components. |
| Routing | **react-router-dom v7** | `BrowserRouter` + rutas planas. |
| Iconos | **lucide-react** | Stroke 1.5–2px, tamaño 14–20px típico. |
| Tablas (cuando hace falta paginar/ordenar) | **@tanstack/react-table** | Solo si la tabla es compleja; tabla HTML plana si es simple. |
| HTTP | **`fetch` nativo** | Centralizado en `src/services/api.ts`. **No** axios. |
| Auth | JWT contra el portal PROESA | Cookie httpOnly `cc_session` en prod; login local solo dev. |
| Idioma | **Español (México)** con acentos correctos | UI, commits, PRs, errores, todo. |

---

## 2. Estructura de carpetas (frontend)

```
frontend/src/
├── App.tsx                  ← <BrowserRouter> + <AuthProvider> + <Routes>
├── main.tsx                 ← entrypoint (1 línea de ReactDOM.createRoot)
├── index.css                ← @import "tailwindcss";
├── components/
│   ├── BackToPortal.tsx     ← link "← Portal PROESA" (siempre visible en header)
│   ├── ProtectedRoute.tsx
│   ├── layout/
│   │   ├── Layout.tsx       ← <Sidebar/> + <Header/> + <main>{children}</main>
│   │   ├── Sidebar.tsx      ← navegación primaria, slate-950, colapsable
│   │   └── Header.tsx       ← h-14, BackToPortal + título + indicadores
│   └── ui/                  ← primitivos reutilizables (ver §6)
│       ├── Button.tsx
│       ├── Card.tsx         ← Card / CardHeader / CardBody
│       ├── Badge.tsx
│       ├── Modal.tsx
│       ├── ConfirmModal.tsx
│       ├── Toast.tsx
│       ├── Spinner.tsx
│       └── ...específicos de la app (autocompletes, etc.)
├── contexts/
│   └── AuthContext.tsx      ← user, login, logout, hasRole(), mustChangePassword
├── hooks/
│   ├── useApi.ts
│   └── useToast.ts
├── pages/                   ← una carpeta o archivo por ruta
│   ├── Login.tsx
│   ├── Dashboard.tsx        ← "Inicio"
│   ├── <Feature>.tsx
│   └── <feature>/<Tab>.tsx  ← sub-tabs si la página los tiene
├── services/
│   └── api.ts               ← un archivo, namespaces por dominio
├── utils/
│   └── dates.ts             ← timezone America/Mexico_City siempre
└── (sin más)
```

> Nuevo endpoint → extender `services/api.ts`. Nueva página → archivo en `pages/` + ruta en `App.tsx` + entrada en `Sidebar.tsx`.

---

## 3. Tokens de diseño (Tailwind)

Tailwind 4 con tokens del DS PROESA, definidos una sola vez en `index.css`:

```css
@import "tailwindcss";

@theme {
  /* Marca */
  --color-proesa-navy-900: #14275A;
  --color-proesa-navy-700: #204590;   /* primario, headlines, botones */
  --color-proesa-navy-500: #4B86C7;
  --color-proesa-navy-300: #8CC4EA;
  --color-proesa-navy-100: #E3EEF8;
  --color-proesa-navy-50:  #F2F7FC;
  --color-proesa-teal-700: #2C8A7A;
  --color-proesa-teal-600: #37A992;   /* acento, success */
  --color-proesa-teal-100: #E2F2EC;

  /* Tipografía */
  --font-sans: "Source Sans 3", "Calibri", "Segoe UI", system-ui, sans-serif;
}
```

**Pero en código JSX usamos los aliases `blue` / `slate` / `gray` / `green` / `amber` / `red` de Tailwind** porque ya empatan visualmente con los tokens PROESA:

| Rol | Clase Tailwind | Equivalente DS |
|---|---|---|
| Brand primario | `blue-600` (hover `blue-700`) | navy-700 |
| Brand oscuro / sidebar | `slate-950` | navy-900 |
| Acento / éxito | `green-600` o `emerald-600` | teal-600 |
| Warning | `amber-600/700` | warning |
| Danger | `red-600` | danger |
| Texto principal | `gray-900` | ink |
| Texto secundario | `gray-500` / `gray-600` | fg-muted |
| Texto tenue | `gray-400` | fg-subtle |
| Bordes | `gray-100` (suaves) / `gray-200` (default) / `gray-300` (inputs) | border / border-strong |
| Fondo página | `gray-50` | bg-subtle |
| Fondo card | `white` | bg |

> **Regla:** nunca uses `purple`, `pink`, `orange`, `yellow` puros. Si necesitas un color extra, levanta la mano: probablemente sea un mal patrón.

### Tipografía — sólo cinco tamaños usados

| Token | Clase | Cuándo |
|---|---|---|
| Title de página | `text-base font-semibold tracking-tight` (sí, base — el header es compacto) | `<Header title=…>` |
| Card title | `text-base font-semibold` | `<CardHeader title=…>` |
| KPI grande | `text-2xl font-semibold` | KpiCard |
| Body | `text-sm` | default en todo |
| Eyebrow / label de sección | `text-[11px] uppercase tracking-wider font-semibold text-gray-500` | section headers |
| Hint / helper | `text-xs text-gray-400` ó `text-[11px] text-gray-500` | helper de input, fechas pequeñas |

**Nada más grande que `text-2xl` dentro de la app.** Las stats grandes-grandes (style "55", "+1,000") quedan reservadas para el portal y materiales de marca, no para herramientas.

### Espaciado

- Página: `p-6` en el `<main>`.
- Card padding interno: `p-5` (header y body).
- Form spacing vertical: `gap-4`.
- Spacing entre cards/secciones: `gap-4` o `gap-5`.

### Radii

- Cards, modales, login card: `rounded-xl` (12px).
- Inputs, botones, tiles: `rounded-lg` (8px).
- Pills de filtro / badges: `rounded-full`.

### Sombra

- Card en reposo: `shadow-sm`.
- Card hover (cuando es clickeable): `shadow-md`.
- Modal: `shadow-xl`.
- Login card: `shadow-xl`.
- Botón primario/danger: `shadow-sm`.

### Transiciones

- `transition-colors duration-150` en links, botones, filas de tabla, pills.
- `transition-all duration-300` solo en sidebar collapse.
- Sin spring physics, sin parallax, sin entrance scale-up. Hover lift máximo `translate-y-[-1px]` o nada.

---

## 4. Shell de aplicación (todas comparten esto)

Toda página renderiza dentro de `<Layout title=… subtitle=…>`. Layout = `<Sidebar/>` + `<Header/>` + `<main>`. **No improvises shells alternativos** — eso es lo que hace que las apps se sientan parientes.

### 4.1 Sidebar — `slate-950`, colapsable, secciones

- Ancho `w-60` expandido, `w-16` colapsado, transición 300ms.
- Fondo `bg-slate-950`, divisores `border-white/[0.06]`.
- **Brand mark arriba**:
  - Cuadrado `w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20`.
  - Icono Lucide blanco `w-4 h-4` representativo de la app (ej: `ShieldCheck` para Coberturas, `ShoppingCart` para Compras).
  - Texto: `<p className="text-white text-sm font-bold tracking-tight">{nombreApp}</p>` + `<p className="text-slate-500 text-[11px]">PROESA</p>`.
- Nav agrupada en **secciones con título** uppercase 10px (`Operación`, `Nómina`, `Administración`, `Soporte`). Divisor `h-px bg-white/[0.06]` entre secciones.
- Items: `flex gap-3 px-3 py-2.5 rounded-lg text-sm font-medium`.
  - Inactivo: `text-slate-400 hover:bg-white/[0.06] hover:text-slate-200`.
  - Activo: `bg-blue-600/90 text-white shadow-md shadow-blue-600/20`.
  - Icono Lucide tamaño 18.
- Botón **Cerrar sesión** abajo, mismo estilo de item inactivo, icono `LogOut`.
- Footer: nombre del usuario + `PROESA · {nombreApp}` + versión, todo en gris muy oscuro.
- Toggle: botón circular blanco `w-6 h-6` flotando en el borde derecho del sidebar a `top-1/2`, con icono `PanelLeftClose` / `PanelLeftOpen`.

> Filtra items por rol con `roles?: Role[]` en cada NavItem; si el usuario no tiene rol, esconde el item y la sección si queda vacía.

### 4.2 Header — blur, sticky, una sola línea + divisor

> **Update v1.1**: Releída la base de PurchasePlanning, el patrón real es **una sola línea** con divisor vertical entre BackToPortal y el título — no breadcrumb apilado. La diferencia es que el portal-link queda a la izquierda del divisor con padding propio (`px-2 py-1 rounded-lg`) y un hover state visible (`hover:bg-blue-50/60 hover:text-blue-600`), lo cual lo separa visualmente del título sin necesitar segunda línea. Esa es la convención canonizada.

- `h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-6 flex items-center justify-between flex-shrink-0`.
- **Izquierda — fila plana** `flex items-center gap-3`:
  1. `<BackToPortal/>` — chip con padding propio y hover azul (ver §4.3).
  2. **Divisor vertical**: `<span class="hidden sm:inline-block w-px h-4 bg-gray-200" aria-hidden></span>`.
  3. Título + ayuda + subtítulo en `flex items-baseline gap-2`:
     - `<h1 class="text-base font-semibold text-gray-900 tracking-tight">{title}</h1>`
     - `<HelpButton topicId/>` opcional, alineado a center (`self-center`).
     - `<span class="text-xs text-gray-400">{subtitle}</span>` opcional.
- **Derecha — "Última sync" global**: el Header consume `syncApi.getStatus()` al montar y, si hay sync, pinta `<Clock w-3 h-3/> Última sync: {dd/mm/yyyy hh:mm}` con `text-[11px] text-gray-400`. Esto es **estándar** en toda app que sincroniza con un ERP, no opcional. Otras pills de estado (pendientes, alertas) van a la derecha también.

### 4.3 BackToPortal — obligatorio

```tsx
const PORTAL_URL = import.meta.env.VITE_PORTAL_URL ?? 'https://portal.grupoproesa.mx:9443';
const DEV_LOCAL_LOGIN = import.meta.env.VITE_DEV_LOCAL_LOGIN === 'true';

export function BackToPortal() {
  if (DEV_LOCAL_LOGIN) return null; // sin portal en dev
  return (
    <a
      href={PORTAL_URL}
      title="Volver al Portal PROESA"
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium
                 text-gray-500 hover:text-blue-600 hover:bg-blue-50/60
                 transition-colors"
    >
      <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="whitespace-nowrap">Portal PROESA</span>
    </a>
  );
}
```

- **Fallback duro** a `https://portal.grupoproesa.mx:9443` si no hay `VITE_PORTAL_URL`.
- **Se oculta en dev local** cuando `VITE_DEV_LOCAL_LOGIN=true`.
- Tiene padding propio + hover azul — **no es un link gris pelón**, es un chip compacto con identidad.

---

## 5. Plantilla de página (Inicio / Dashboard de la app)

Toda mini-app tiene un Dashboard de bienvenida con esta estructura, en este orden:

1. **Card de saludo** — `<Card>` con `<CardBody>`: `Hola, {primerNombre} 👋` (text-lg font-semibold), una línea de bienvenida, badges de roles del usuario, link "Centro de ayuda" arriba a la derecha.
2. **KPIs propios del rol activo** — sección con eyebrow "TU ACTIVIDAD" + grid de 3 tiles `<KpiCard>`. Filtra por rol: el jefe ve KPIs de jefe, nómina ve KPIs de nómina.
3. **Estado del sistema** (si la app tiene sync externo, jobs, etc.) — solo admin.
4. **Acciones rápidas** — eyebrow + grid de tiles `<ActionTile>` con icono+label, navegan a las rutas principales.

Cada sección tiene un eyebrow `text-[11px] uppercase tracking-wider font-semibold text-gray-500` arriba.

`max-w-5xl` para el contenedor del dashboard. Otras páginas usan `max-w-2xl` (formularios) o ancho completo (listados).

---

## 6. Componentes UI canónicos

Estos viven en `components/ui/` y se reutilizan idénticos entre apps. **Si los necesitas, no los reinventes.** Si necesitas variantes nuevas, agrégalas con un nombre claro y mantén la firma.

### 6.1 Button

5 variantes × 3 tamaños. Loading prop, leftIcon, disabled.

```tsx
<Button variant="primary" size="md" loading={saving} leftIcon={<Save size={16} />}>
  Guardar
</Button>
```

| Variante | Clase principal |
|---|---|
| `primary` (default) | `bg-blue-600 hover:bg-blue-700 text-white shadow-sm` |
| `secondary` | `bg-gray-100 hover:bg-gray-200 text-gray-700` |
| `danger` | `bg-red-600 hover:bg-red-700 text-white shadow-sm` |
| `ghost` | `bg-transparent hover:bg-gray-100 text-gray-600` |
| `outline` | `bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm` |

| Tamaño | Padding |
|---|---|
| `sm` | `px-3 py-1.5 text-sm gap-1.5` |
| `md` | `px-4 py-2 text-sm gap-2` |
| `lg` | `px-5 py-2.5 text-base gap-2` |

Focus ring: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`. Disabled: `opacity-50 cursor-not-allowed`.

### 6.2 Card / CardHeader / CardBody

```tsx
<Card>
  <CardHeader
    title="Historial"
    subtitle="Coberturas que has registrado"
    helpTopic="mis-coberturas"        // opcional → ícono ? a /ayuda/<topic>
    actions={<Button>Acción</Button>}  // opcional
  />
  <CardBody>{contenido}</CardBody>
</Card>
```

- `Card`: `bg-white rounded-xl border border-gray-200 shadow-sm`.
- `CardHeader`: `flex justify-between items-start p-5 border-b border-gray-100`. Título `text-base font-semibold text-gray-900`, subtítulo `text-sm text-gray-500 mt-0.5`.
- `CardBody`: `p-5`.
- `helpTopic`: si está, renderiza un `<Link to="/ayuda/{topic}">` con ícono `HelpCircle` que vive a la derecha del título, `w-6 h-6 rounded-full hover:text-blue-600 hover:bg-blue-50`.

### 6.3 Badge

`inline-flex items-center font-medium rounded-full`, sizes `sm` (default, `px-2 py-0.5 text-xs`) y `md`.

| Variante | Clase |
|---|---|
| `default` | `bg-blue-100 text-blue-800` |
| `success` | `bg-green-100 text-green-800` |
| `error` | `bg-red-100 text-red-800` |
| `warning` | `bg-yellow-100 text-yellow-800` |
| `info` | `bg-sky-100 text-sky-800` |
| `neutral` | `bg-gray-100 text-gray-700` |

### 6.4 Modal / ConfirmModal

- Backdrop `bg-black/40` fixed inset-0 z-50, content `rounded-xl shadow-xl bg-white` con `max-h-[90vh] flex flex-col`.
- Header: `p-5 border-b border-gray-100`, título `text-base font-semibold` + botón cerrar `<X>` arriba a la derecha.
- Body: `p-5 overflow-auto flex-1`.
- Footer (opcional): `p-5 border-t border-gray-100 flex justify-end gap-2`.
- Tamaños: `sm` (max-w-md), `md` (max-w-lg, default), `lg` (max-w-2xl).
- `ConfirmModal` envuelve `Modal` con prop `variant: 'default' | 'danger'`, `confirmLabel`, `loading`. Usa botón `danger` si variant es danger.

### 6.5 Toast

- Container `fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full`.
- 4 tipos: success (green), error (red), info (blue), warning (yellow). Cada uno con su `bg-{c}-50 border-{c}-400 text-{c}-800` y un icono Lucide del mismo color (saturado).
- Auto-dismiss después de ~4s, también botón `<X>`.
- Hook `useToast()` expone `{ toasts, show, dismiss }`. Render `<ToastContainer toasts={toasts} dismiss={dismiss} />` arriba del `<Layout>` o dentro.

### 6.6 Spinner

Pequeño, neutro. `w-4 h-4` border animate-spin. Nada más.

### 6.7 Inputs nativos (no hay componente Input, intencional)

Los inputs son HTML estándar con clases canónicas — siempre las mismas:

```tsx
className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
```

Aplica a `<input>`, `<select>`, `<textarea>`. Si vas a usar la misma clase en 3 sitios, factorízala en una constante `INPUT_CLASS` dentro del archivo, no crees un wrapper.

Label estándar:

```tsx
<label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
```

Helper text bajo el input: `<p className="text-[11px] text-gray-400 mt-1">…</p>`.

Los formularios definen un componente local pequeño:

```tsx
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
```

### 6.8 Tabla canónica

Tabla HTML simple para listados < 200 filas. Para más, `@tanstack/react-table`.

```tsx
<div className="border border-gray-200 rounded-lg overflow-hidden">
  <table className="w-full text-sm">
    <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
      <tr>
        <th className="text-left px-4 py-2">Fecha</th>
        ...
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-2 text-gray-900 align-top">…</td>
        ...
      </tr>
    </tbody>
  </table>
</div>
```

- Numéricos: `font-mono text-gray-700`.
- Acciones por fila: columna derecha con `flex gap-1 justify-end` de `<Button size="sm" variant="ghost" leftIcon=…>`.

### 6.9 Filtros pill

```tsx
<div className="flex gap-1 mb-4">
  {filtros.map(f => (
    <button
      onClick={() => setEstado(f.value)}
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
        estado === f.value
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      {f.label}
    </button>
  ))}
</div>
```

### 6.10 KpiCard

```tsx
<KpiCard
  label="Mis pendientes"
  hint="Esperan decisión"
  value={count}
  icon={<Clock size={18} />}
  tone="amber"      // gray | amber | amber-strong | green | blue | blue-strong
  to="/mis-coberturas"  // opcional → todo el card es <Link>
/>
```

- Card `rounded-xl border shadow-sm p-4 hover:shadow-md`.
- Header: label en eyebrow + icono en chip cuadrado `w-7 h-7 rounded-md bg-{tone}-50 text-{tone}-{700}`.
- Valor: `text-2xl font-semibold text-{tone}-{700}`.
- Hint: `text-xs text-gray-500`.
- Si `to` está, todo el card navega.

### 6.11 ActionTile

```tsx
<ActionTile label="Registrar cobertura" icon={<FilePlus size={18} />} onClick={…} />
```

Card `rounded-xl border-gray-200 shadow-sm p-3.5 hover:border-blue-300 hover:bg-blue-50/40 flex items-center gap-3`. Icono en chip `w-8 h-8 rounded-lg bg-blue-50 text-blue-600`. Label `text-sm font-medium text-gray-900`.

---

## 7. Página de Login — patrón único

```
<div min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex items-center justify-center>
  <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
    [brand mark + nombre app + "PROESA"]
    [form con email + password + botón size=lg w-full]
    [error en bloque rojo: rounded-lg bg-red-50 border-red-200 px-3 py-2 text-red-700]
  </div>
</div>
```

Si SSO está activo (no DEV_LOCAL_LOGIN), redirige al portal. Si `mustChangePassword`, swap del form por un form de cambio de contraseña con misma chrome.

---

## 8. Estados vacíos, carga y error

- **Carga inicial de página entera**: `<Layout title>` + `<div className="flex justify-center py-12"><Spinner/></div>`.
- **Carga dentro de una card**: `<div className="flex justify-center py-8"><Spinner/></div>`.
- **Vacío**: `<div className="text-sm text-gray-500 py-8 text-center">No hay coberturas en este filtro.</div>`. Texto humano, no "No data".
- **Error inline**: bloque `rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700`.
- **Errores de operación**: toast tipo `error`, no alert.

---

## 9. Iconografía Lucide — convenciones

- Tamaño por defecto en línea de texto: `size={14}` o `size={16}`.
- En cards y headers: `size={18}`.
- En tiles y KPIs: `size={18}`.
- En el brand mark: `w-4 h-4` (16px).
- Stroke 2 (default Lucide). No mezclamos estilos rellenos.

**Iconos preferidos por dominio**, para que las apps "rimen":

| Concepto | Icono |
|---|---|
| Inicio / dashboard | `LayoutDashboard` |
| Crear / nuevo | `Plus`, `FilePlus` |
| Editar | `Pencil` |
| Eliminar | `Trash2` |
| Aprobar / decisión | `CheckSquare`, `CheckCircle2` |
| Listado propio | `ListChecks` |
| Reportes / Excel | `FileSpreadsheet` |
| Usuarios | `Users` |
| Configuración | `Settings`, `Settings2` |
| Ayuda | `HelpCircle` |
| Brand de app (lab/medical) | `ShieldCheck`, `Microscope`, `Activity`, `Beaker` |
| Notificación | `Bell` |
| Sync / tiempo | `Clock`, `RefreshCw` |
| Volver | `ArrowLeft` |

---

## 10. Tono y copywriting

- **Español MX**, segunda persona informal (`tú`) en UI, formal sólo en correos a paciente.
- **Botones = verbo claro**: `Registrar`, `Aprobar`, `Guardar cambios`, `Eliminar`. No "OK", no "Submit".
- **Títulos de página = sustantivo corto**: "Inicio", "Mis coberturas", "Pendientes de aprobación", "Reportes", "Usuarios", "Configuración", "Ayuda".
- **Subtítulo de página = aclaración chiquita** (text-xs text-gray-400): "Registradas por mí", "Resumen del día".
- **Mensajes de éxito/error son frases**, no códigos: `"Cobertura eliminada"`, `"Error al actualizar"`, `"Las contraseñas nuevas no coinciden"`.
- **Cargando**: `"Cargando…"` (con elipsis tipográfica `…` no tres puntos).
- **Vacío**: `"No hay X en este filtro."`, `"Sin pendientes"`. Nunca *"You have no items"* traducido literal.
- Sin emoji excepto el `👋` del saludo de Dashboard. Es el único permitido.
- Sin signos de exclamación en UI institucional. La voz es calmada.

---

## 11. Fechas, números y zonas horarias

- **Timezone fija**: `America/Mexico_City`. Helper en `utils/dates.ts`.
- Formato fecha corta: `DD/MM/YYYY` (`formatDateMx`).
- Formato fecha+hora: `DD/MM/YYYY HH:mm` (`formatDateTimeMx`).
- Hoy: `todayMxISO()` → string ISO 'YYYY-MM-DD'.
- Money: `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 })`.
- Numéricos en tablas: `font-mono` para alinear.

---

## 12. Auth y roles

- `AuthContext` expone: `user`, `isAuthenticated`, `loading`, `mustChangePassword`, `login()`, `logout()`, `changePassword()`, `hasRole(role)`.
- Roles típicos: `admin`, `nomina`, y un rol funcional propio de la app (ej. `jefe`, `comprador`, `coordinador`). Documenta los roles de tu app en su `CLAUDE.md`.
- Wrap rutas con `<ProtectedRoute>`. Variantes: `requireRole="admin"`, `requireAnyRole={['nomina','admin']}`, sin prop = solo logueado.
- Filtrar items de Sidebar por rol con la misma lógica.

---

## 13. Accesibilidad mínima

- Todo botón con `aria-label` si solo tiene icono.
- Inputs con `<label htmlFor>`.
- `focus:ring-2 focus:ring-blue-500` visible en todo control interactivo.
- Modal cerrable con click afuera + tecla Esc.
- Color nunca es la única señal (badges + texto, no solo color).

---

## 14. Lo que **no** hacemos

- ❌ Sidebar con fondo blanco o de color marca. **Siempre `slate-950`.**
- ❌ Tarjetas con borde de acento de color y nada de contenido — el patrón es `border-gray-200 + shadow-sm`, no fancy.
- ❌ Iniciales coloridas como avatar de feature ("ED", "PD", "CD"). Usa iconos Lucide.
- ❌ Gradientes en cards o botones (excepto el brand mark cuadrado y el fondo del Login).
- ❌ Animaciones de entrada con scale/translate dramáticos. Hover lift máximo 1–2px.
- ❌ Drop-shadows multicolor o glow.
- ❌ Stack de toasts gigante. Si hay más de 3 toasts simultáneos, hay un bug.
- ❌ Modales encima de modales. Si lo necesitas, repensar el flujo.
- ❌ Iconos con relleno + contorno mezclados. Solo Lucide stroke.
- ❌ Más de 2 colores semánticos en un mismo grid de KPIs.

---

## 15. Checklist de "se ve PROESA"

Antes de marchar:

- [ ] Sidebar `slate-950` con secciones y brand mark gradient blue.
- [ ] Header `min-h-16` con breadcrumb `← Portal PROESA / {App}` arriba (text-[11px]) y título compacto + subtitle abajo.
- [ ] Cards `rounded-xl border-gray-200 shadow-sm`, headers `border-b border-gray-100`.
- [ ] Botón primario `blue-600`, danger `red-600`, ghost gris.
- [ ] Inputs con la clase canónica (`border-gray-300 rounded-lg focus:ring-blue-500`).
- [ ] Tabla con header `bg-gray-50 text-[11px] uppercase tracking-wider`.
- [ ] Eyebrow de sección `text-[11px] uppercase tracking-wider font-semibold text-gray-500`.
- [ ] Iconos Lucide, stroke default, sin emoji extra.
- [ ] Toasts top-right, 4 tipos, auto-dismiss.
- [ ] Modal con backdrop `bg-black/40` y card `rounded-xl shadow-xl`.
- [ ] Login con gradient `slate-900 → blue-950` y card centrada.
- [ ] Texto en español MX, sin signos de exclamación.
- [ ] Timezone `America/Mexico_City` en toda fecha.
- [ ] `VITE_PORTAL_URL` configurado y `BackToPortal` visible.
- [ ] `npx tsc -b --noEmit` y `npm run build` limpios.

---

## 16. Snippets para arrancar una mini-app nueva

### `src/index.css`
```css
@import "tailwindcss";

@theme {
  --color-proesa-navy-700: #204590;
  --color-proesa-teal-600: #37A992;
  --font-sans: "Source Sans 3", "Calibri", "Segoe UI", system-ui, sans-serif;
}

html, body, #root { height: 100%; }
body { font-family: var(--font-sans); }
```

### `src/main.tsx`
```tsx
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
createRoot(document.getElementById('root')!).render(<App />);
```

### `src/App.tsx`
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppRoutes() {
  const { isAuthenticated, mustChangePassword, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-sm text-gray-500">Cargando…</p></div>;
  if (isAuthenticated && mustChangePassword) return <LoginPage />;
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>;
}
```

### Una página típica — `pages/MiFeature.tsx`
```tsx
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export function MiFeaturePage() {
  return (
    <Layout title="Mi feature" subtitle="Descripción corta">
      <Card>
        <CardHeader
          title="Sección"
          subtitle="Contexto de la sección"
          helpTopic="mi-feature"
          actions={<Button leftIcon={<Plus size={16} />}>Nueva</Button>}
        />
        <CardBody>{/* contenido */}</CardBody>
      </Card>
    </Layout>
  );
}
```

---

## 17. Cómo evolucionar este patrón

- Si una app necesita un componente nuevo de UI que probablemente otras también necesiten → **propónlo aquí** vía PR a este archivo y compártelo entre repos antes de codear N versiones distintas.
- Si una app necesita un color o spacing fuera de tabla → es una pista de que el patrón está incompleto. Levantar issue.
- No fork-ees el sidebar o el header. Esos son la firma del ecosistema.

---

**Versión:** 1.0 · 2026-04
**Mantenedor:** Equipo de plataforma PROESA
**Apps de referencia:** `control-coberturas`, `purchase-planning`
