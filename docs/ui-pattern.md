# Patrón UI · Mini-apps del Ecosistema PROESA

> Guía canónica para que toda mini-app que vive detrás del Portal PROESA se vea, suene y se sienta como parte del mismo ecosistema, aunque cada una resuelva un problema distinto.
>
> Esta es la **fuente de verdad consolidada**. Reemplaza las versiones v1.0 / v2.0 / v2.1 / v2.2 (preservadas en `references/design-system/pattern_docs/` para trazabilidad histórica).
>
> **Cómo usarla con Claude Code:** este archivo es leído por agentes al arrancar o auditar una app PROESA. Está escrito para humanos pero optimizado para máquinas: reglas explícitas, ejemplos canónicos, anti-patrones marcados.

---

## 0. Identidad del ecosistema en una línea

Cada mini-app es **una herramienta interna seria, calmada y eficiente** que vive dentro de un portal corporativo de salud. La voz es **institucional-cálida**, los colores son **navy + teal sobre blanco-clínico**, y la tipografía es **una sola sans-serif limpia** (Source Sans 3).

Si dudas, pregúntate: *¿esta UI se ve bien junto a un reporte de laboratorio impreso?* Si la respuesta es no, retrocede.

---

## 1. Stack

| Capa | Canónico | Aceptable en migración |
|---|---|---|
| Framework | React 18+ + Vite + TypeScript strict | JSX puro + Vite, Refine + Antd, Next.js |
| Estilos | Tailwind v4 + tokens PROESA | Tailwind v3, CSS modules, vanilla CSS — siempre con tokens PROESA |
| Routing | react-router-dom v6+ | — |
| Iconos | `lucide-react` | — |
| Tablas complejas | `@tanstack/react-table` | — |
| HTTP | `fetch` nativo, centralizado en `services/api.ts` | axios si la app legacy ya lo tiene |
| Auth | JWT contra `proesa-gateway`, cookie httpOnly | — |
| Idioma | Español MX con acentos correctos | — |

**Regla:** la firma visual (sidebar navy-900, header con PortalChip, brand mark gradient navy→teal, cards `rounded-xl shadow-sm`) **no es negociable** sin importar el stack.

---

## 2. Estructura de carpetas (apps consumidoras)

```
frontend/src/
├── App.tsx                  ← BrowserRouter + AuthProvider + Routes
├── main.tsx                 ← entrypoint de 1 línea
├── index.css                ← @import tailwindcss + tokens + preset
├── components/
│   ├── ProtectedRoute.tsx   ← (o usar el de @proesa/design)
│   └── ui/                  ← primitivos específicos de la app (autocompletes con su API)
├── contexts/
│   └── AuthContext.tsx      ← extiende el de @proesa/design con la API de auth de la app
├── hooks/
├── pages/                   ← un archivo por ruta
├── services/
│   └── api.ts               ← un archivo, namespaces por dominio
└── utils/
```

> Nuevo endpoint → extender `services/api.ts`. Nueva página → archivo en `pages/` + ruta en `App.tsx` + entrada en `Sidebar`.

---

## 3. Color y tipografía

### Tokens PROESA (obligatorios)

Toda app del ecosistema **debe** consumir los tokens del paquete (`@proesa/design/tokens`). Está prohibido usar paleta Tailwind cruda (`slate-*`, `blue-*`) para superficies brand: produce mini-apps visualmente desconectadas del Portal.

| Variable | Hex | Uso |
|---|---|---|
| `--proesa-navy-900` | `#14275A` | Sidebar background |
| `--proesa-navy-800` | `#1B3373` | Hover de primary CTA |
| `--proesa-navy-700` | `#204590` | **Brand primario.** CTAs, sidebar item activo, KPI azul |
| `--proesa-navy-500` | `#4B86C7` | Texto sobre superficies brand |
| `--proesa-navy-300` | `#8CC4EA` | KPI `blue-strong` border |
| `--proesa-navy-200` | `#BFDBF1` | KPI `blue` border |
| `--proesa-navy-100` | `#E3EEF8` | KPI `blue-strong` bg, badge info |
| `--proesa-navy-50`  | `#F2F7FC` | KPI `blue` bg, hover sutil |
| `--proesa-teal-700` | `#2C8A7A` | Hover de accent |
| `--proesa-teal-600` | `#37A992` | **Accent.** Brand mark gradient |
| `--proesa-mist`     | `#F4F6FA` | Body / canvas |
| `--proesa-fog`      | `#E7EAF1` | Borders |
| `--proesa-ink`      | `#0F1626` | Texto principal |

### Mapeo Tailwind crudo → PROESA

Donde una app legacy usa Tailwind crudo, sustituir así:

| Uso | Tailwind crudo | PROESA |
|---|---|---|
| Sidebar background | `bg-slate-950` | `var(--proesa-navy-900)` |
| Sidebar item activo | `bg-blue-600` | `var(--proesa-navy-700)` |
| Body / canvas | `bg-slate-100` | `var(--proesa-mist)` |
| Borders | `border-gray-200` | `var(--proesa-fog)` |
| Primary CTA | `bg-blue-600 hover:bg-blue-700` | `bg-[#204590] hover:bg-[#1B3373]` |
| KPI `blue` (bg/text/border) | `blue-50 / blue-700 / blue-200` | `#F2F7FC / #204590 / #BFDBF1` |
| KPI `blue-strong` | `blue-100 / blue-800 / blue-300` | `#E3EEF8 / #14275A / #8CC4EA` |
| Avatar usuario | `from-blue-500 to-blue-600` | `var(--proesa-brand-gradient)` |
| Login background | `from-slate-900 via-slate-950 to-blue-950` | `from-[#14275A] via-[#1B3373] to-[#1F6056]` |

### Tonos semánticos (verde / ámbar / rojo)

Los tonos semánticos **se mantienen en Tailwind nativo**. Son colores funcionales (estado de un dato), no brand. Cambiarlos los acercaría al teal corporativo y rompería el contrato semántico.

| Estado | Color permitido |
|---|---|
| Success ("ok", "al corriente", "pagado") | `green-*` (escoger uno y mantenerlo en toda la app) |
| Warning genérico ("advertencia", "vigilar") | `amber-*` o `yellow-*` (no ambos) |
| Riesgo medio (aging 31-60d) | `orange-*` — **solo** para escala de aging, no warning genérico |
| Danger | `red-*` |
| Info | `sky-*` o `blue-*` (uno solo en la app) |

**Trampa Chromium.** Los gradientes con paradas porcentuales explícitas y `var()` deben usar `backgroundImage:` longhand, no `background:` shorthand. Chromium ignora silenciosamente el shorthand.

### Tipografía — solo cinco tamaños

| Token | Clase | Cuándo |
|---|---|---|
| Title de página | `text-base font-semibold tracking-tight` | `<Header title=…>` |
| Card title | `text-base font-semibold` | `<CardHeader title=…>` |
| KPI grande | `text-2xl font-semibold` | `<KpiCard>` |
| Body | `text-sm` | default en todo |
| Eyebrow / label de sección | `text-[11px] uppercase tracking-wider font-semibold text-gray-500` | section headers |
| Hint / helper | `text-xs text-gray-400` ó `text-[11px] text-gray-500` | helper de input |

**Nada más grande que `text-2xl` dentro de la app.** Stats grandes-grandes ("55", "+1,000") son del Portal y materiales de marca, no de herramientas.

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
- Card hover (clickeable): `shadow-md`.
- Modal: `shadow-xl`.
- Login card: `shadow-xl`.
- Brand mark: `shadow` con tinte navy (ver `--proesa-shadow-brand`).

### Transiciones

- `transition-colors duration-150` en links, botones, filas de tabla, pills.
- `transition-all duration-300` solo en sidebar collapse.
- Sin spring physics, sin parallax. Hover lift máximo `translate-y-[-1px]` o nada.

---

## 4. Shell de aplicación

Toda página renderiza dentro de `<Layout title=… subtitle=…>`. Layout = `<Sidebar/>` + `<Header/>` + `<main>`. **No improvisar shells alternativos** — eso es lo que hace que las apps se sientan parientes.

### 4.1 Sidebar

- Ancho `w-60` expandido, `w-16` colapsado, transición 300ms.
- Fondo `var(--proesa-navy-900)`, divisores `border-white/[0.06]`.
- **Brand mark arriba**: cuadrado `w-8 h-8 rounded-lg` con `var(--proesa-brand-gradient)` y `box-shadow: var(--proesa-shadow-brand)`. Icono Lucide blanco `size={16}` representativo del dominio (ver §9).
- Texto del brand: `<p className="text-white text-sm font-bold tracking-tight">{nombreApp}</p>` + `<p className="text-[11px]" style={{color: 'var(--proesa-navy-300)'}}>PROESA</p>`.
- Nav agrupada en **secciones con título** (`Operación`, `Administración`, `Soporte`). Eyebrow `text-[10px] uppercase tracking-wider font-semibold text-slate-500`. Divisor `h-px bg-white/[0.06]` entre secciones.
- Items: `flex gap-3 px-3 py-2.5 rounded-lg text-sm font-medium`.
  - Inactivo: `text-slate-400 hover:bg-white/[0.06] hover:text-slate-200`.
  - Activo: `text-white` con `style={{ background: 'var(--proesa-navy-700)' }}` y sombra `0 4px 8px -2px rgba(20,39,90,0.3)`.
- Botón **Cerrar sesión** abajo, mismo estilo de item inactivo, icono `LogOut`.
- Footer: nombre del usuario + `PROESA · {nombreApp}` + versión, gris muy oscuro.
- Toggle: botón `w-5 h-10` flotando en el borde derecho a `top-1/2`, icono `ChevronLeft` / `ChevronRight`.

#### Filtrado por rol

```ts
const visibleSections = navSections
  .map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.roles || item.roles.some((r) => hasRole(r))),
  }))
  .filter((section) => section.items.length > 0);
```

- El divisor entre grupos solo se renderiza cuando `sIdx > 0` **dentro de la lista filtrada**, no de la original.
- "Inicio" no pertenece a ninguna sección y siempre es visible.
- Los roles van **por item**, nunca por sección.

#### Shape canónico de la nav

```ts
type Role = "admin" | "jefe" | "nomina" | string;

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  roles?: Role[]; // si se omite, visible para todos los autenticados
}

interface NavSection {
  title: string | null; // null = sin eyebrow (solo "Inicio")
  items: NavItem[];
}
```

### 4.2 Header

`h-14 bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-6 flex items-center justify-between flex-shrink-0`.

**Layout — derecha a izquierda:**

```
[BackToPortal=PortalChip] | [Título] [HelpButton] [subtítulo]      [PendientesPill] [AlertPill] [SyncStatus] [user menu]
```

- **Izquierda — fila plana** `flex items-center gap-3`:
  1. `<PortalChip/>` — pill canónica (ver §4.3). Primer elemento, siempre.
  2. **Divisor vertical**: `<span class="hidden sm:inline-block w-px h-4 bg-gray-200" aria-hidden></span>`.
  3. Título + ayuda + subtítulo en `flex items-baseline gap-2`:
     - `<h1 class="text-base font-semibold text-gray-900 tracking-tight">{title}</h1>`
     - `<HelpButton topicId/>` opcional, `self-center`.
     - `<span class="text-xs text-gray-400">{subtitle}</span>` opcional.
- **Derecha — orden canónico**: `[user menu] [SyncStatus] [AlertPill] [PendientesPill]`. Pendientes es lo más cercano al título porque es lo que el usuario más mira.

### 4.3 PortalChip — el regreso al Portal

**Reemplaza** patrones previos como "← Portal PROESA" texto plano. La pill canónica comunica tres cosas a la vez:

1. "Estás dentro de una app del ecosistema PROESA"
2. "El Portal es tu salida / tu casa"
3. "Click aquí te lleva ahí"

```tsx
<PortalChip />  // del paquete, configurado con import.meta.env.VITE_PORTAL_URL
```

- **Posición fija:** primer elemento del header.
- **Hover translate-x:** `translateX(-1px)` refuerza la dirección "regreso".
- **No mostrar el nombre de la app dentro del chip.** El chip dice de dónde **vino**.
- **Si la mini-app se abre directo:** el chip sigue presente; `href` apunta al Portal estático. Es un "ir al Portal".
- **Mobile (`<640px`):** ocultar texto "Portal", dejar avatar+caret. El `title` sigue ahí para a11y.

### 4.4 Brand mark

```tsx
<BrandMark icon="Shield" />  // del paquete; el icono cambia por app, el gradient no
```

- **El gradient es invariable.** No customizar por app. Es la firma visual del ecosistema.
- **El icono sí cambia** por app. Lucide siempre.
- El mismo gradient se usa en: brand mark del sidebar, avatar de usuario en el header, brand mark del Login, `PortalChip__avatar`.

| Tipo de app | Icono brand sugerido |
|---|---|
| Cobertura / seguros | `Shield`, `ShieldCheck` |
| Compras / aprovisionamiento | `ShoppingCart` |
| Crédito / cartera / cobranza | `Landmark`, `CircleDollarSign` |
| Laboratorio / operaciones clínicas | `Microscope`, `Activity` |
| Reporting / BI | `BarChart3` |
| Recursos humanos | `Users` |
| Inventarios | `Boxes` |

---

## 5. Plantilla de Inicio (obligatoria)

Toda mini-app debe tener una ruta `/` que sea Inicio (no la primera página de operación). Estructura mínima:

1. **Card de saludo** — `Hola, {primerNombre} 👋`, una línea de bienvenida, badges de roles, link "Centro de ayuda" arriba a la derecha.
2. **KPIs propios del rol activo** — sección con eyebrow "TU ACTIVIDAD" + grid de 3 tiles `<KpiCard>`. Filtra por rol.
3. **Estado del sistema** (apps con sync externo) — solo admin.
4. **Acciones rápidas** — eyebrow + grid de tiles `<ActionTile>`.

`max-w-5xl` para el contenedor del dashboard. Otras páginas: `max-w-2xl` (formularios) o ancho completo (listados).

KPIs por rol — ejemplo financiero:

| Rol | 3 KPIs sugeridos |
|---|---|
| Operador de cobranza | Mis cuentas asignadas, Promesas de pago hoy, Vencido +60d |
| Jefe / coordinador | Saldo total cartera, % mora >30d (con delta), Cuentas en revisión |
| Dirección | Cartera total, Días promedio de cobranza, Score promedio del portafolio |

**Filtra los KPIs por `hasRole(...)`. No muestres KPIs vacíos en `0`.**

---

## 6. Componentes UI canónicos

Estos viven en `@proesa/design` y se reutilizan idénticos entre apps. **Si los necesitas, no los reinventes.** Si necesitas variantes nuevas, agrégalas con un nombre claro y mantén la firma — primero PR al paquete, no fork local.

### Núcleo (todas las apps)

| Componente | Import | Cuándo |
|---|---|---|
| `Button` | `@proesa/design` | Acciones. 5 variantes × 3 sizes |
| `Card` / `CardHeader` / `CardBody` | `@proesa/design` | Contenedor estándar |
| `Badge` | `@proesa/design` | Estado o tag inline |
| `Modal` / `ConfirmModal` | `@proesa/design` | Diálogos. Sin modal sobre modal |
| `Toast` / `ToastContainer` / `useToast` | `@proesa/design` | Mensajes de operación |
| `Spinner` | `@proesa/design` | Carga local |
| `HelpButton` | `@proesa/design` | Navega a `/ayuda/{topic}` |
| `HelpPopover` | `@proesa/design` | Popover inline para fórmulas |
| `Field` + `INPUT_CLASS` | `@proesa/design` | Inputs nativos con clase canónica |
| `KpiCard` | `@proesa/design/components/data` | Métrica con label, valor, delta opcional |
| `ActionTile` | `@proesa/design/components/data` | Botón grande con icono + label |
| `FilterPills` | `@proesa/design/components/data` | Filtros segmentados |
| `DataTable` | `@proesa/design/components/data` | Tabla HTML simple. Para datasets grandes, tanstack |

### Opt-in (solo si la app las necesita)

| Componente | Import | Cuándo |
|---|---|---|
| `PendientesPill` | `@proesa/design/components/notifications` | Apps con flujo de aprobación / cola de tareas |
| `AlertPill` + `AlertDrawer` + `AlertaCard` | `@proesa/design/components/notifications` | Apps con notificaciones de sistema |
| `SyncStatus` | `@proesa/design/components/notifications` | Apps que sincronizan con ERP |
| `EstadoSistemaCard` | `@proesa/design/components/data` | Bloque "Estado del sistema" en Inicio admin |
| `MoneyCell` | `@proesa/design/components/data` | Tablas con montos. Apps financieras |
| `RiskBadge` | `@proesa/design/components/domain` | Apps financieras / cartera |
| `AgingBar` | `@proesa/design/components/domain` | Apps de cartera / antigüedad de saldo |

### Reglas de los KPIs

- **Tonos disponibles**: `gray`, `blue`, `blue-strong`, `green`, `green-strong`, `amber`, `amber-strong`, `red`, `red-strong`.
- **Máximo 1 `-strong` por sección de KPIs.** Dos KPIs héroe es ningún KPI héroe.
- **No pintar todo `-strong` por importancia subjetiva.** El `-strong` es el que el usuario mirará primero.
- En modo "todo en cero / sin datos", el héroe pierde el `-strong` y vuelve al tono base.

### Reglas de la tabla

- Numéricos: `font-mono tabular-nums`.
- Acciones por fila: columna derecha con `flex gap-1 justify-end` de `<Button size="sm" variant="ghost">`.
- Header: `bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider`.
- Filas: `hover:bg-gray-50`, `border-b border-gray-100`.

### Reglas para tablas financieras

- Alineación derecha en columnas de monto, header también.
- `tabular-nums` además de `font-mono`. Source Sans 3 tiene `font-feature-settings: "tnum"`, úsalo: más legible que monoespacio.
- Total al final con `border-t-2 border-gray-300 font-semibold bg-gray-50`.
- Ceros: `text-gray-400` (no negro).
- Negativos: `text-red-700` con paréntesis: `($1,234.56)` — usar `<MoneyCell>`.
- Densidad: `py-2.5` (no `py-2`) en filas de tabla financiera.
- Sticky header si la tabla supera ~15 filas.
- Filtro de período obligatorio sobre toda tabla con datos temporales.

### Reglas de aging

- `RiskBadge` con escala discreta: `verde → amarillo → naranja → rojo`. Naranja es **solo** aging 31-60d, no warning genérico.
- `AgingBar` renderiza barra `h-3 rounded-full` con segmentos proporcionales. Si el saldo es 100% corriente, la barra es completamente verde — no esconder.

### Reglas de notificaciones

`PendientesPill` ≠ `AlertPill`. Son slots distintos.

| Concepto | `PendientesPill` | `AlertPill` |
|---|---|---|
| Naturaleza | Trabajo operativo del usuario | Notificaciones del sistema |
| Acción al click | **Navega** a página de pendientes | **Abre drawer** lateral |
| Texto | Explícito ("3 por autorizar") | Solo número |
| Visible | Solo si el rol tiene pendientes | Siempre, si la app tiene alertas |

`EstadoSistemaCard` maneja 4 estados, no asume "ok":

| Estado | Icono | Tone | Texto |
|---|---|---|---|
| `ok` | `CheckCircle2` | `green` | "Última corrida: {fecha} · OK" |
| `running` | `Loader2` (animate-spin) | `blue` | "Sincronizando ahora…" |
| `failed` | `AlertTriangle` | `red` | "Última corrida falló: {fecha}. {error}" |
| `never_run` | `Clock` | `gray` | "Aún sin corridas registradas." |

---

## 7. Login

Template canónico en `@proesa/design`:

```tsx
import { LoginPage } from "@proesa/design";
<Route path="/login" element={<LoginPage appName="Mi App" />} />
```

- Fondo: gradient `from-[#14275A] via-[#1B3373] to-[#1F6056]` con `backgroundImage:` longhand.
- Card centrada `bg-white rounded-2xl shadow-xl max-w-md p-8`.
- Brand mark + nombre app + "PROESA" arriba.
- Form email + password + botón `size="lg" w-full`.
- Error en bloque rojo: `rounded-lg bg-red-50 border-red-200 px-3 py-2 text-red-700`.

Si SSO está activo (no `VITE_DEV_LOCAL_LOGIN`), redirige al portal. Si `mustChangePassword`, swap del form por un form de cambio de contraseña con misma chrome.

---

## 8. Estados vacíos, carga y error

- **Carga inicial de página entera**: `<Layout title>` + `<div className="flex justify-center py-12"><Spinner/></div>`.
- **Carga dentro de una card**: `<div className="flex justify-center py-8"><Spinner/></div>`.
- **Vacío**: `<div className="text-sm text-gray-500 py-8 text-center">No hay coberturas en este filtro.</div>`. Texto humano, no "No data".
- **Error inline**: bloque `rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700`.
- **Errores de operación**: toast tipo `error`, no `alert()`.

---

## 9. Iconografía

Ver `docs/iconography.md` para detalle. Resumen:

- Tamaño en línea de texto: `size={14}` o `size={16}`.
- En cards y headers: `size={18}`.
- En tiles y KPIs: `size={18}`.
- En el brand mark: `size={16}`.
- Stroke 2 (default Lucide). No mezclar estilos rellenos.

---

## 10. Tono y copywriting

Ver `docs/voice-and-tone.md` para detalle. Reglas críticas:

- **Español MX**, segunda persona informal (`tú`) en UI.
- **Botones = verbo claro**: `Registrar`, `Aprobar`, `Guardar cambios`. No "OK", no "Submit".
- **Títulos de página = sustantivo corto**: "Inicio", "Mis coberturas", "Pendientes de aprobación".
- **Mensajes son frases**, no códigos: `"Cobertura eliminada"`, `"Error al actualizar"`.
- **Cargando**: `"Cargando…"` (con elipsis tipográfica `…` no tres puntos).
- **Vacío**: `"No hay X en este filtro."`, `"Sin pendientes"`. Nunca *"You have no items"*.
- Sin emoji excepto el `👋` del saludo de Dashboard.
- Sin signos de exclamación en UI institucional. La voz es calmada.

---

## 11. Fechas, números y zonas horarias

- **Timezone fija**: `America/Mexico_City`.
- Helpers en `@proesa/design/utils`:
  - `formatDateMx(d)` → `DD/MM/YYYY`.
  - `formatDateTimeMx(d)` → `DD/MM/YYYY HH:mm`.
  - `todayMxISO()` → `YYYY-MM-DD`.
  - `formatRelative(iso)` → `ahora`, `hace 3m`, `hace 2h`, `ayer`, `hace 5d`, `12/04`.
  - `formatMoneyMx(n)` → `$1,234`.
  - `formatNumberMx(n)` → `1,234`.
  - `formatPercentMx(n)` → `12.3%`.
- Numéricos en tablas: `font-mono` para alinear, o `tabular-nums`.

---

## 12. Auth y roles

- `AuthContext` expone: `user`, `isAuthenticated`, `loading`, `mustChangePassword`, `login()`, `logout()`, `hasRole(role)`.
- Roles típicos: `admin`, `nomina`, y un rol funcional propio de la app.
- Wrap rutas con `<ProtectedRoute>`. Variantes: `requireRole="admin"`, `requireAnyRole={['nomina','admin']}`.
- Filtrar items de Sidebar por rol con la misma lógica.

Ver `docs/auth-and-sso.md` para cómo conectar al Portal Gateway.

---

## 13. Tiempo real (polling)

Para indicadores de tiempo real (pendientes, contadores, sync status), usar `useLivePoll`:

```tsx
import { useLivePoll } from "@proesa/design";

const data = useLivePoll(() => api.pendingCount(), {
  ms: 60_000,
  enabled: hasRole("jefe"),
});
```

Reglas:
- **60 segundos** por default. Subir a 5min si la API es costosa; nunca bajar de 30s sin razón.
- **Refetch en `window focus`** — la sensación de frescura es 80% del valor.
- **Try/catch silencioso** — un indicador no debe gritar errores; simplemente no actualiza.
- **Condicional al rol** — si `enabled` es falso, ni siquiera arranca el intervalo.

---

## 14. Accesibilidad mínima

- Todo botón con `aria-label` si solo tiene icono.
- Inputs con `<label htmlFor>`.
- `focus:ring-2 focus:ring-[#204590]` visible en todo control interactivo.
- Modal cerrable con click afuera + tecla Esc.
- Color nunca es la única señal (badges + texto, no solo color).

---

## 15. Lo que **no** hacemos

- ❌ Sidebar con fondo blanco o de color marca. **Siempre `var(--proesa-navy-900)`.**
- ❌ Tarjetas con borde de acento de color y nada de contenido — el patrón es `border-gray-200 + shadow-sm`, no fancy.
- ❌ Iniciales coloridas como avatar de feature ("ED", "PD"). Usa iconos Lucide.
- ❌ Gradientes en cards o botones (excepto brand mark cuadrado y fondo del Login).
- ❌ Animaciones de entrada con scale/translate dramáticos. Hover lift máximo 1-2px.
- ❌ Drop-shadows multicolor o glow.
- ❌ Stack de toasts gigante. Si hay más de 3 toasts simultáneos, hay un bug.
- ❌ Modales encima de modales. Si lo necesitas, repensar el flujo.
- ❌ Iconos con relleno + contorno mezclados. Solo Lucide stroke.
- ❌ Más de 2 colores semánticos en un mismo grid de KPIs.
- ❌ "Tarjeta KPI con número gigante text-5xl". El máximo es `text-2xl`.
- ❌ Pintar la barra de aging con gradient continuo arcoíris. Son **5 segmentos discretos**.
- ❌ `from-emerald-500 to-emerald-600` en cualquier brand mark. Solo gradient PROESA.
- ❌ Mostrar "$0.00" en negro fuerte. Cero es ausencia, va en gris.
- ❌ Pill de notificaciones siempre roja "para llamar la atención". Roja **solo** si hay críticas reales.
- ❌ Drawer de alertas con `bg-red-50` global. El contenedor es blanco; cada alerta lleva su semántica en su `border-l`.
- ❌ Colorear filas enteras de tabla por estado. El estado va en una **columna** (Badge), no en el fondo.
- ❌ Texto en español sin acentos. "Numero", "Pagina", "Codigo" están prohibidos.

---

## 16. Checklist de "se ve PROESA"

Antes de marcar como listo:

- [ ] Tokens PROESA importados en `index.css` (`@proesa/design/tokens` + `preset` si Tailwind v4).
- [ ] Sidebar usa `var(--proesa-navy-900)` y secciones con eyebrow.
- [ ] Sidebar item activo usa `var(--proesa-navy-700)`.
- [ ] Sidebar brand mark usa el gradient invariable PROESA.
- [ ] Sidebar footer dice `PROESA · {App}` + versión, no marca interna.
- [ ] Header tiene `<PortalChip/>` como primer elemento + divisor + título.
- [ ] Avatar de usuario en header usa el gradient PROESA.
- [ ] Login usa gradient `navy-900 → navy-800 → teal-900` con `backgroundImage:` longhand.
- [ ] Existe ruta `/` Inicio con saludo + KPIs por rol + acciones rápidas.
- [ ] KPIs azules usan los hex PROESA, no `blue-700` / `blue-100`.
- [ ] Cards `rounded-xl border-gray-200 shadow-sm`, headers `border-b border-gray-100`.
- [ ] Inputs con `INPUT_CLASS` o equivalente (border `gray-300`, focus ring navy).
- [ ] Tabla con header `bg-gray-50 text-[11px] uppercase tracking-wider`.
- [ ] Eyebrows `text-[11px] uppercase tracking-wider font-semibold text-gray-500`.
- [ ] Iconos Lucide, stroke default, sin emoji extra (excepto `👋` en Dashboard).
- [ ] Toasts top-right, 4 tipos, auto-dismiss.
- [ ] Modal backdrop `bg-black/40` y card `rounded-xl shadow-xl`.
- [ ] Texto en español MX con acentos correctos.
- [ ] Timezone `America/Mexico_City` en toda fecha (helpers de `@proesa/design/utils`).
- [ ] `VITE_PORTAL_URL` configurado y `<PortalChip/>` visible.
- [ ] Si la app es financiera: `RiskBadge` y `AgingBar` con escala canónica; `MoneyCell` para montos.
- [ ] `npx tsc -b --noEmit` y `npm run build` limpios.

---

## 17. Cómo evolucionar este patrón

- Si una app necesita un componente nuevo de UI que probablemente otras también necesiten → **propónlo al paquete** vía PR a `r-tapia22/proesa-design-system`. No fork-ear.
- Si una app necesita un color o spacing fuera de tabla → es una pista de que el patrón está incompleto. Levantar issue.
- No fork-ear el sidebar, header, o brand mark. Esos son la firma del ecosistema.
- Cambios al patrón se discuten primero en `docs/adr/` antes de tocar componentes.

---

**Versión del paquete:** 0.1.0 · 2026-05
**Mantenedor:** Equipo de plataforma PROESA
