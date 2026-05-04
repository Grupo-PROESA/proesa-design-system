# Patrón UI · Mini-apps del Ecosistema PROESA — v2.0

> **Esta es una extensión incremental de [UI-PATTERN.md v1.0](./UI-PATTERN.md), no un reemplazo.**
> Toda regla v1.0 sigue vigente salvo que aquí se anote `**OVERRIDE v1**`. Los nuevos bloques aplican a TODAS las mini-apps; las secciones marcadas `[dominio: financiero]` aplican solo a apps con cartera, crédito, cobranza o flujos monetarios (ControlConsumos, futuras apps de cobranza, tesorería, etc.).
>
> **Cambios principales vs v1.0:**
> 1. Patrón de **escalado de marca** para apps que viven en stack distinto (JSX puro, sin TypeScript) — no obliga a portar a TS para "verse PROESA".
> 2. Patrón de **Dashboard de Inicio** ahora es obligatorio, con plantilla concreta.
> 3. **Header v1.1** (una línea + divisor) canonizado y con slots nuevos: pill de alertas, drawer de notificaciones.
> 4. Componentes nuevos: **`KpiCard` financiero**, **`RiskBadge`**, **`AgingBar`**, **`AlertPill` + `AlertDrawer`**, **`HelpPopover`** (versión inline del HelpButton).
> 5. **Sidebar con grupos** explícitos por dominio operativo.
> 6. Tipografía **Source Sans 3** carga estándar via `<link>` para apps sin pipeline Tailwind 4.
> 7. **Reglas de color semántico vs marca** — cuándo verde, cuándo azul, cuándo evitar conflicto.

---

## A. Stack flexible — apps fuera de TypeScript / Tailwind 4

**OVERRIDE v1 §1.** El stack canónico (React 19 + Vite + TS strict + Tailwind 4) sigue siendo el objetivo, pero apps existentes en **JSX puro + Tailwind 3 + Vite** son ciudadanos de primera clase si cumplen el resto del patrón visual.

| Caso | Mínimo aceptable |
|---|---|
| App nueva | TS strict + Tailwind 4 (v1 §1 al pie de la letra) |
| App existente en JSX | JSX + Tailwind 3, **sin** mezclar CSS-in-JS, **sin** UI-libraries (no MUI, no Antd, no Chakra). Migración a TS es trabajo separado. |
| Tipografía sin Tailwind 4 `@theme` | Cargar Source Sans 3 vía `<link>` en `index.html` (ver §B) y declarar `font-family` en `body` desde `index.css`. |

**Regla:** la firma visual (sidebar slate-950, header con BackToPortal, brand mark gradient blue, cards `rounded-xl shadow-sm`) **no es negociable** sin importar el stack. Lo que sí es negociable: TS, tokens `@theme`, react-router v7 vs v6.

---

## B. Tipografía — carga universal

**Adición a v1 §3.** Para que apps fuera de Tailwind 4 hereden la familia institucional sin gimnasia:

### `index.html`
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### `index.css` (top)
```css
:root {
  --font-sans: 'Source Sans 3', 'Calibri', 'Segoe UI', system-ui, sans-serif;
}
html, body { font-family: var(--font-sans); }
```

Si la app usa Tailwind 3 y quiere que las clases `font-sans` apunten ahí, añade en `tailwind.config.js`:
```js
theme: { extend: { fontFamily: { sans: ['Source Sans 3', 'Calibri', 'Segoe UI', 'system-ui', 'sans-serif'] } } }
```

---

## C. Color — marca vs semántica (lectura crítica)

**Aclaración a v1 §3.** El conflicto más común al "PROESA-fy" una app existente es **verde**. Reglas explícitas:

| Uso | Color permitido | Prohibido |
|---|---|---|
| Brand primario, CTAs, focus rings, sidebar activo, KPI primario | `blue-600` / `blue-700` / `blue-50` / `blue-100` | `emerald-*`, `green-*` como brand |
| Success semántico (estado "al corriente", pago aplicado, sync ok, toast success) | `green-600` / `green-100` / `green-800` (o `emerald` equivalente — escoger uno y mantenerlo) | Mezclar `green` y `emerald` en la misma app |
| Riesgo/aging/severidad | Escala discreta verde→amarillo→naranja→rojo (ver §F.2) | Inventar otra escala |
| Warning | `amber-*` / `yellow-*` (uno solo, no ambos) | Naranja para warning genérico (naranja se reserva al aging 31–60d) |
| Danger | `red-600` / `red-50` / `red-700` | Rosa, magenta |
| Info / pill de alerta | `sky-*` o `blue-*` | Mezclar ambos en la misma vista |

**Regla operativa para apps que migran desde otro brand color:** todo lugar donde había verde como *brand* (Login, botones primarios, focus rings, estado activo) → swap a `blue-600`. Todo lugar donde el verde era *semántico* ("OK", "Pagado", "Al corriente") → se queda. Si dudas: ¿el color comunica una *afirmación de marca* o el *estado de un dato*? Marca → blue. Estado → semántico.

---

## D. Sidebar v2 — grupos obligatorios + brand mark contextual

**Refinamiento a v1 §4.1.** Toda app con **5 o más rutas en el sidebar** debe agruparlas:

```
[BRAND MARK + nombre app + "PROESA"]
─────────────────────────────────────
Inicio
─────────────────────────────────────
OPERACIÓN
  · Ruta 1
  · Ruta 2
  · Ruta 3
─────────────────────────────────────
ADMINISTRACIÓN
  · Reportes
  · Configuración
─────────────────────────────────────
SOPORTE
  · Sincronización
  · Ayuda
─────────────────────────────────────
[Cerrar sesión]
{usuario · PROESA · App · v1.x}
```

- Eyebrow de sección: `text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-3 py-2`.
- Divisor entre grupos: `<div className="h-px bg-white/[0.06] my-2 mx-3" />`.
- "Inicio" siempre primero, sin sección, **siempre presente** (ver §E).
- Brand mark del sidebar: usa un icono Lucide **del dominio**, no iniciales:

| Tipo de app | Icono brand sugerido |
|---|---|
| Cobertura/seguros | `ShieldCheck` |
| Compras/aprovisionamiento | `ShoppingCart` |
| Crédito/cartera/cobranza | `Landmark` o `CircleDollarSign` |
| Laboratorio/operaciones clínicas | `Microscope` o `Activity` |
| Reporting/BI | `BarChart3` |
| Recursos humanos | `Users` |

**Footer obligatorio v2:** sustituye cualquier marca interna ("LANS", nombre del depto, etc.) por `PROESA · {NombreApp}` + versión. La identidad de quién opera la app es del **portal**, no de la app individual.

```jsx
<div className="px-4 py-3 border-t border-white/[0.06] text-[11px] leading-tight">
  <p className="text-slate-300 font-medium truncate">{user.nombre}</p>
  <p className="text-slate-500">PROESA · Control de Consumos</p>
  <p className="text-slate-600 mt-0.5">v{APP_VERSION}</p>
</div>
```

---

## E. Header v1.1 canonizado — slots nuevos

**Refinamiento a v1 §4.2.** El header de una línea + divisor es la versión final. Slots de derecha a izquierda:

```
[BackToPortal] | [Título] [HelpButton] [subtítulo]      [AlertPill] [SyncStatus] [user menu]
```

### E.1 SyncStatus (apps que sincronizan con ERP)

**Obligatorio** en cualquier app que consuma datos externos cacheados. Consume `syncApi.getStatus()` (o equivalente) al montar el Header.

```jsx
<button
  onClick={() => navigate('/sync')}
  title={`Última sync: ${formatDateTimeMx(lastSync)}`}
  className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
>
  <Clock className="w-3 h-3" />
  <span className="hidden md:inline">Última sync:</span>
  <span className="font-medium tabular-nums">{formatRelative(lastSync)}</span>
  {syncStale && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
</button>
```

- `syncStale = (now - lastSync) > umbral_app` — el dot ámbar avisa silenciosamente.
- Click navega a la página de Sync. No abrir modal.

### E.2 AlertPill (apps con alertas o notificaciones)

Sustituye el "buzón" tipo bell genérico por una pill **con conteo y semántica**:

```jsx
<button
  onClick={() => setAlertDrawerOpen(true)}
  className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
    ${unreadCritical > 0
      ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
      : unreadTotal > 0
      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
      : 'text-gray-500 hover:bg-gray-100 border border-transparent'}`}
>
  <Bell className="w-3.5 h-3.5" />
  {unreadTotal > 0 && <span className="tabular-nums">{unreadTotal}</span>}
  {unreadCritical > 0 && (
    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
  )}
</button>
```

- Sin alertas: solo el icono gris, no rojo. La pill no grita por defecto.
- Con alertas no críticas: ámbar.
- Con al menos 1 crítica: rojo + dot.
- Abre **AlertDrawer** (ver §F.4), no un modal.

### E.3 BackToPortal — refinado

Igual que v1 §4.3 pero **siempre con divisor vertical** después, no opcional:

```jsx
<div className="flex items-center gap-3 min-w-0">
  <BackToPortal />
  <span className="hidden sm:inline-block w-px h-4 bg-gray-200 flex-shrink-0" aria-hidden />
  <h1 className="text-base font-semibold text-gray-900 tracking-tight truncate">{title}</h1>
  {helpTopic && <HelpButton topicId={helpTopic} />}
  {subtitle && <span className="hidden md:inline text-xs text-gray-400 truncate">{subtitle}</span>}
</div>
```

---

## F. Componentes nuevos

### F.1 `KpiCard` — versión financiera

Extiende v1 §6.10 con dos features que apps de cartera necesitan:

```jsx
<KpiCard
  label="Saldo cartera"
  value={4_287_350}
  format="currency"          // 'currency' | 'percent' | 'number' | 'custom'
  delta={-12.4}              // opcional, Δ vs período anterior
  deltaLabel="vs mes pasado"
  tone="blue"                // mantiene paleta v1
  icon={<Landmark size={18} />}
  to="/credito"
/>
```

- `format="currency"` → `Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN', maximumFractionDigits:0 })`.
- `delta` se pinta abajo del valor: `text-xs` con flecha `ArrowUp`/`ArrowDown` y color `green-600` si delta favorable, `red-600` si desfavorable. **La interpretación de "favorable" depende del KPI** — declara `deltaPositive: 'good' | 'bad'` cuando una baja es buena (ej. mora baja = bueno).
- Valor con `tabular-nums` siempre.

### F.2 `RiskBadge` — escala de aging/riesgo canónica

```jsx
<RiskBadge category="amarillo" score={68} size="sm" />
```

| Categoría | bg | text | dot | label default |
|---|---|---|---|---|
| `verde` | `bg-green-100` | `text-green-800` | `bg-green-500` | "Al corriente" |
| `amarillo` | `bg-yellow-100` | `text-yellow-800` | `bg-yellow-500` | "Vigilar" |
| `naranja` | `bg-orange-100` | `text-orange-800` | `bg-orange-500` | "Riesgo" |
| `rojo` | `bg-red-100` | `text-red-800` | `bg-red-500` | "Crítico" |

- Naranja **solo** se usa para riesgo medio/aging 31–60d. **No** para warning genérico (eso es ámbar).
- Tamaño `sm` (default): `px-2.5 py-1 rounded-full text-xs`. Tamaño `lg`: `px-4 py-2 rounded-lg text-base font-bold` (para detalle de score).

### F.3 `AgingBar` — visualización de antigüedad de saldo

Patrón visual canónico para cualquier app con cartera:

```jsx
<AgingBar
  buckets={[
    { key: 'corriente',       label: 'Corriente', amount: 1_250_000, color: 'bg-green-500' },
    { key: 'vencido_1_30',    label: '1–30d',     amount: 340_000,   color: 'bg-yellow-500' },
    { key: 'vencido_31_60',   label: '31–60d',    amount: 120_000,   color: 'bg-orange-500' },
    { key: 'vencido_61_90',   label: '61–90d',    amount: 45_000,    color: 'bg-red-400' },
    { key: 'vencido_90_plus', label: '90+d',      amount: 22_000,    color: 'bg-red-600' },
  ]}
  total={1_777_000}
/>
```

- Renderiza una barra `h-3 rounded-full overflow-hidden flex` con segmentos proporcionales.
- Tooltip por segmento: `{label}: {money} ({pct}%)`.
- Debajo, leyenda compacta con dot + label + monto en `flex flex-wrap gap-x-4 gap-y-1 text-xs`.
- Si el saldo es 100% corriente, la barra es completamente verde (no esconder).

### F.4 `AlertDrawer` — panel lateral derecho

Sustituye el patrón de "lista de alertas embebida en el dashboard". Trigger desde `AlertPill` (§E.2).

- Drawer fijo derecho, `w-96`, `bg-white`, `border-l border-gray-200`, slide-in desde derecha en 200ms.
- Backdrop `bg-black/30` cubriendo el resto del viewport.
- Header del drawer: `p-4 border-b border-gray-100 flex justify-between items-center` con `<h2 className="text-base font-semibold">Alertas</h2>` + filtros `Todas / No leídas / Críticas` (filter pills v1 §6.9) + botón cerrar `X`.
- Body scrollable: lista vertical de `<AlertaCard>` (ver §F.5).
- Footer opcional: `<button>Marcar todas como leídas</button>` ghost.

### F.5 `AlertaCard` — refinado

Reemplaza la versión actual con border-left "i!" character soup por una versión con icono Lucide:

```jsx
<AlertaCard
  alerta={{
    severidad: 'critical',  // 'critical' | 'warning' | 'info' | 'success'
    titulo: 'Saldo vencido +90 días',
    mensaje: '...',
    cliente: 'Lab Clínico XYZ',
    created_at: '...',
    leida: false,
  }}
  onMarcarLeida={fn}
  onClick={fn}              // navega al recurso
/>
```

Visual:
- `border-l-4 border-l-{severity-color}` (rojo/naranja/azul/verde).
- `bg-white hover:bg-gray-50` (no `bg-{color}-50` — eso satura el drawer cuando hay 20 alertas).
- Icono Lucide `w-4 h-4` arriba-izquierda en chip cuadrado `w-7 h-7 rounded-md bg-{severity-color}-100 text-{severity-color}-700`. Iconos: `AlertTriangle` (critical), `AlertCircle` (warning), `Info` (info), `CheckCircle2` (success).
- Title `text-sm font-medium text-gray-900`.
- Mensaje `text-xs text-gray-600 mt-0.5`.
- Cliente/contexto `text-[11px] text-gray-500 mt-1`.
- Fecha relativa abajo a la derecha `text-[11px] text-gray-400` (`hace 3h`, `ayer`, `12/04`).
- Si `leida`: `opacity-60` y un dot azul ausente. Si `!leida`: dot azul `w-1.5 h-1.5 rounded-full bg-blue-500` arriba a la derecha.

### F.6 `HelpPopover` (inline)

Versión refinada del `MetricInfo` actual — **válido dentro de `<p>`** porque solo usa `<span>`. Diferencias vs v1 `HelpButton`:

| `HelpButton` (v1 §4.2) | `HelpPopover` (v2 §F.6) |
|---|---|
| Navega a `/ayuda/{topic}` | Abre popover inline con definición |
| Para topics que necesitan página completa | Para fórmulas y métricas con explicación corta |
| Icono `HelpCircle` 16px | Letra `i` en chip `w-4 h-4 bg-gray-300` |
| En títulos de cards | Junto a labels de métricas en cards |

**Cuál usar:** página de ayuda dedicada → `HelpButton`. Tooltip de fórmula → `HelpPopover`. No competir.

```jsx
<span className="inline-flex items-baseline gap-1">
  Score de riesgo
  <HelpPopover
    title="Score de riesgo"
    description="Calificación 0-100 que combina antigüedad de saldo, % de cumplimiento y volumen."
    formula="0.5·(1 - mora%) + 0.3·cumplimiento + 0.2·log(volumen)"
    ranges={[
      { label: '80-100: Al corriente', color: 'bg-green-500' },
      { label: '60-79: Vigilar',       color: 'bg-yellow-500' },
      { label: '40-59: Riesgo',        color: 'bg-orange-500' },
      { label: '0-39: Crítico',        color: 'bg-red-500' },
    ]}
  />
</span>
```

### F.7 `MoneyCell` — celda de tabla para montos

```jsx
<td className="px-4 py-2 text-right">
  <MoneyCell amount={123_456.78} negative={amount < 0} muted={amount === 0} />
</td>
```

- `font-mono tabular-nums text-sm`.
- `negative`: rojo `text-red-700` con paréntesis: `($1,234.56)`.
- `muted`: `text-gray-400`.
- Default: `text-gray-900`.
- Currency siempre MXN salvo override.

---

## G. Plantilla de "Inicio" — ahora obligatoria

**OVERRIDE v1 §5.** Toda mini-app debe tener una ruta `/` que sea Inicio (no la primera página de operación). Estructura mínima:

```jsx
<Layout title="Inicio" subtitle="Resumen del día">
  <div className="max-w-5xl flex flex-col gap-5">
    {/* 1. Saludo */}
    <Card>
      <CardBody className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Hola, {primerNombre} 👋</h2>
          <p className="text-sm text-gray-500 mt-1">Tienes {pendientes} pendientes hoy.</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.roles.map(r => <Badge key={r} variant="neutral">{r}</Badge>)}
          </div>
        </div>
        <Link to="/ayuda" className="text-xs text-gray-500 hover:text-blue-600 inline-flex items-center gap-1.5">
          <HelpCircle size={14} /> Centro de ayuda
        </Link>
      </CardBody>
    </Card>

    {/* 2. KPIs del rol activo */}
    <section>
      <h3 className="eyebrow mb-3">Tu actividad</h3>
      <div className="grid grid-cols-3 gap-3">
        <KpiCard ... />
        <KpiCard ... />
        <KpiCard ... />
      </div>
    </section>

    {/* 3. Estado del sistema (solo admin/operadores) */}
    {hasRole('admin') && (
      <section>
        <h3 className="eyebrow mb-3">Estado del sistema</h3>
        <Card><CardBody>...</CardBody></Card>
      </section>
    )}

    {/* 4. Acciones rápidas */}
    <section>
      <h3 className="eyebrow mb-3">Acciones rápidas</h3>
      <div className="grid grid-cols-4 gap-2.5">
        <ActionTile ... />
      </div>
    </section>
  </div>
</Layout>
```

**KPIs de Inicio para apps financieras** (ejemplo ControlConsumos):

| Rol | 3 KPIs sugeridos |
|---|---|
| Operador de cobranza | Mis cuentas asignadas, Promesas de pago hoy, Vencido +60d |
| Jefe / coordinador | Saldo total cartera, % mora >30d (con delta vs mes pasado), Cuentas en revisión |
| Dirección | Cartera total, Días promedio de cobranza, Score promedio del portafolio |
| Admin/sync | Última sincronización, Registros desincronizados, Errores últimas 24h |

Filtra los KPIs por `hasRole(...)`. **No muestres KPIs vacíos en `0`.**

---

## H. Tablas para datos financieros [dominio: financiero]

**Adición a v1 §6.8.** Cuando una tabla muestra montos:

- **Alineación numérica:** todas las columnas de monto **a la derecha**, header también.
- **Numbers tabulares:** `tabular-nums` además de `font-mono`. Si tu fuente sans tiene tabular figures (Source Sans 3 las tiene con `font-feature-settings: "tnum"`), úsalas — más legible que monoespacio.
- **Totales:** fila de total al final con `border-t-2 border-gray-300 font-semibold bg-gray-50`.
- **Ceros:** `text-gray-400` (no negro) — el ojo descansa en lo que importa.
- **Negativos:** `text-red-700` con paréntesis `($1,234.56)`.
- **Densidad:** padding `py-2.5` (no `py-2`) en filas de tabla financiera — más cómodo de leer en cantidades.
- **Sticky header** si la tabla supera ~15 filas: `<thead className="sticky top-0 bg-gray-50 z-10">` dentro de un wrapper con altura fija.
- **Filtro de período obligatorio** sobre toda tabla con datos temporales: select `Hoy / 7d / 30d / Mes actual / Mes anterior / Personalizado` arriba a la derecha.

---

## I. Migración desde verde-brand a azul-brand (playbook)

Para apps existentes con otro brand color (caso ControlConsumos: emerald):

1. **Inventario.** Buscar todos los `emerald-*` y `green-*` en el código. Clasificar cada match en uno de:
   - **Brand** (botón primario, focus ring, sidebar activo, login mark, links primarios) → cambiar a `blue-*` equivalente.
   - **Semántico** (estado "ok", "pagado", "al corriente", success toast, dot de aging "corriente", check de validación) → mantener.
   - **Indeterminado** → llevar a revisión, decidir caso por caso.
2. **Login.** Rehacer del todo siguiendo v1 §7: gradient `slate-900 → blue-950`, brand mark `from-blue-500 to-blue-600`, botón `bg-blue-600`. Es la primera impresión.
3. **Sidebar.** Cambiar el activo de gris/blanco a `bg-blue-600/90 text-white shadow-blue-600/20`.
4. **Brand mark del sidebar.** Si era texto ("CC"), cambiar por icono Lucide del dominio (§D).
5. **Footer del sidebar.** Quitar nombre interno (departamento, marca local). Poner `PROESA · {App}` + versión.
6. **Header.** Si no existe header propio, montar el v1.1 (§E). `BackToPortal` es no negociable.
7. **Tipografía.** Cargar Source Sans 3 (§B). Si la app usaba Inter o Roboto, swap inmediato — la diferencia es perceptible.
8. **Cards.** Estandarizar a `rounded-xl border-gray-200 shadow-sm`. Eliminar variantes `rounded-2xl shadow-xl` excepto en login y modales.

**No tocar en este pase:** lógica de negocio, schemas de API, nombres de rutas, contratos de componentes. La migración es de chrome y paleta, no de arquitectura.

---

## J. Checklist v2 — adicional al v1 §15

Antes de marchar una app financiera/cartera:

- [ ] Brand color es **blue-600**, no emerald/green/teal/purple. (v2 §C)
- [ ] Sidebar tiene **grupos** con eyebrow si hay 5+ rutas. (v2 §D)
- [ ] Sidebar **brand mark** usa icono Lucide del dominio, no iniciales. (v2 §D)
- [ ] Sidebar footer dice `PROESA · {App}` + versión, no marca interna. (v2 §D)
- [ ] Header tiene `BackToPortal` + divisor + título + `SyncStatus`. (v2 §E)
- [ ] Si la app tiene alertas, hay `AlertPill` en header + `AlertDrawer`, no lista embebida. (v2 §E.2 / F.4)
- [ ] Existe ruta `/` Inicio con saludo + KPIs por rol + acciones rápidas. (v2 §G)
- [ ] KPIs financieros usan `Intl.NumberFormat('es-MX', currency)` y `tabular-nums`.
- [ ] Tablas de monto: alineación derecha + tabular nums + total con border-t-2 + ceros en gris. (v2 §H)
- [ ] Score/riesgo usa la escala canónica verde→amarillo→naranja→rojo (v2 §F.2). No hay "naranja como warning genérico".
- [ ] Source Sans 3 cargada (vía `<link>` o `@theme`). (v2 §B)
- [ ] Toda fecha pasa por `formatDateMx` / `formatDateTimeMx` con TZ `America/Mexico_City`.
- [ ] Help: `HelpButton` para páginas de ayuda, `HelpPopover` para fórmulas inline. No competencia. (v2 §F.6)

---

## K. Lo que **sigue** sin hacerse (refuerzo)

Heredamos v1 §14 íntegro. Adiciones:

- ❌ "Tarjeta KPI con número gigante text-5xl". El máximo es `text-2xl` (v1 §3). Los KPIs de cartera pueden parecer querer ser grandes; resistir.
- ❌ Pintar la barra de aging con gradient continuo arcoíris. Son **5 segmentos discretos** con bordes definidos.
- ❌ Colorear filas enteras de tabla por estado (`bg-red-50` toda la fila para clientes morosos). El estado va en una **columna** (Badge), no en el fondo. Tablas con 8 filas rojas son ilegibles.
- ❌ `from-emerald-500 to-emerald-600` en cualquier brand mark. Solo `from-blue-500 to-blue-600`.
- ❌ Mostrar "$0.00" en negro fuerte. Cero es ausencia, va en gris (v2 §H).
- ❌ Pill de notificaciones siempre roja "para llamar la atención". Roja es **solo** si hay críticas reales (v2 §E.2).
- ❌ Drawer de alertas con `bg-red-50` global. El contenedor es blanco; cada alerta lleva su semántica en su `border-l` (v2 §F.5).

---

## L. Compatibilidad con v1.0

- v1 §1–§17 siguen vigentes en su totalidad excepto donde aparece `**OVERRIDE v1**` arriba.
- v2 es aditivo: una app puede cumplir solo v1 y seguir siendo válida; v2 es obligatorio para apps **financieras/de cartera** o **con sincronización ERP** desde la fecha de adopción.
- Si una regla v2 contradice v1 sin marcar OVERRIDE explícito, gana v1 — reportar como bug del documento.

---

**Versión:** 2.0 · 2026-05
**Mantenedor:** Equipo de plataforma PROESA
**Apps de referencia v2:** ControlConsumos (cartera de crédito), futura app de cobranza
**Apps de referencia v1:** control-coberturas, purchase-planning
