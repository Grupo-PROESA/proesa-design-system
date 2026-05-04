# Patrón UI · Mini-apps del Ecosistema PROESA — v2.1

> **Esta es una extensión incremental de [UI-PATTERN-v2.md](./UI-PATTERN-v2.md), no un reemplazo.**
> Toda regla v1.0 / v2.0 sigue vigente. v2.1 captura **6 hallazgos** que emergieron al revisar `control-coberturas` como app de referencia v1+v2 ya productiva.
>
> **Cambios principales vs v2.0:**
> 1. §D.1 — **filtrado de secciones vacías** del sidebar por rol.
> 2. §D.2 — shape canónico de `navSections` con `roles?: Role[]` por item.
> 3. §E.4 — separación de **`PendientesPill`** (operativa, navega) vs **`AlertPill`** (informativa, abre drawer). Antes en v2 estaban fusionadas.
> 4. §E.5 — patrón canónico de **polling + refetch en focus** para indicadores de tiempo real.
> 5. §F.1.b — `KpiCard` gana tonos **`-strong`** (`blue-strong`, `green-strong`, `amber-strong`, `red-strong`) para el KPI "héroe" de cada sección.
> 6. §G.1 — `EstadoSistemaCard` con **tri/quad-estado** canonizado (`ok | running | failed | never_run`).

---

## D.1 Filtrar secciones vacías por rol

**Adición a v2 §D.** Cuando un rol no tiene visibilidad sobre ningún ítem de un grupo, el grupo entero (eyebrow + divisor + items) **debe colapsarse**. No mostrar eyebrows huérfanos.

```jsx
const visibleSections = navSections
  .map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.roles || item.roles.some((r) => hasRole(r))),
  }))
  .filter((section) => section.items.length > 0);
```

- El divisor entre grupos sólo se renderiza cuando `sIdx > 0` **dentro de la lista filtrada**, no de la original.
- "Inicio" no pertenece a ninguna sección y siempre es visible (v2 §D ya lo decía).

---

## D.2 Shape canónico de la nav

**Formaliza v2 §D.** Toda mini-app declara su nav así:

```ts
type Role = 'admin' | 'jefe' | 'nomina' | string; // según app

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  roles?: Role[];   // si se omite, visible para todos los autenticados
}

interface NavSection {
  title: string | null;  // null = sin eyebrow (sólo "Inicio" debería usarlo)
  items: NavItem[];
}

const navSections: NavSection[] = [
  { title: null,             items: [{ to: '/', label: 'Inicio', icon: LayoutDashboard, exact: true }] },
  { title: 'Operación',      items: [/* ... */] },
  { title: 'Administración', items: [/* sólo admin */] },
  { title: 'Soporte',        items: [{ to: '/ayuda', label: 'Ayuda', icon: HelpCircle }] },
];
```

Antipatrón: poner roles a nivel de sección. La sección debe ser una agrupación **lógica del producto**, no de permisos. Los permisos son de cada ítem; el filtrado de la sección es consecuencia (§D.1), no causa.

---

## E.4 `PendientesPill` vs `AlertPill` — slots distintos

**OVERRIDE v2 §E.2.** v2.0 metía "alertas" y "pendientes" en una sola pill. **Son dos cosas distintas** y deben vivir en dos componentes:

| Concepto | `PendientesPill` | `AlertPill` |
|---|---|---|
| Naturaleza | Trabajo operativo del usuario | Notificaciones del sistema |
| Acción al click | **Navega** a la página de pendientes | **Abre drawer** lateral |
| Texto | Explícito ("3 por autorizar") | Sólo número o icono |
| Color cuando >0 | Ámbar (es trabajo, no urgencia) | Ámbar (warning) o rojo (críticas) |
| Visible | Sólo si el rol tiene pendientes en el dominio | Siempre, si la app tiene alertas |
| Cuándo aparece | Apps con flujo de aprobación / cola de tareas | Apps con notificaciones, eventos, sistema |

```jsx
// PendientesPill — ControlCoberturas, ControlConsumos (cobranza)
<button
  onClick={() => navigate('/pendientes')}
  title={hasPendings ? `${count} cobertura(s) esperando tu decisión` : 'No tienes pendientes por autorizar'}
  className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
    hasPendings
      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
      : 'text-gray-400 hover:bg-gray-50 border-transparent'
  }`}
>
  <Bell size={14} className={hasPendings ? 'text-amber-600' : ''} />
  {hasPendings ? <span>{count} por autorizar</span> : <span className="hidden sm:inline">Sin pendientes</span>}
  {hasPendings && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />}
</button>
```

**Orden en el header (derecha → izquierda):** `[user menu] [SyncStatus] [AlertPill] [PendientesPill]`. Pendientes es lo más cercano al título porque es lo que el usuario más mira.

Una app puede tener uno, otro, ambos o ninguno. Ejemplos:
- ControlCoberturas: sólo `PendientesPill` (no tiene sistema de alertas).
- ControlConsumos (cobranza): ambas — `PendientesPill` (cuentas en revisión) + `AlertPill` (drawer con vencimientos, score caídos).
- PurchasePlanning: ninguna.

---

## E.5 Polling + refetch en focus — patrón canónico

**Adición a v2 §E.** Para cualquier indicador de tiempo real (pendientes, contadores, sync status):

```jsx
const POLL_MS = 60_000;

useEffect(() => {
  if (!hasRole('jefe')) return;        // no polear si no aplica al rol
  let cancelled = false;
  const fetchCount = async () => {
    try {
      const { count } = await api.pendingCount();
      if (!cancelled) setCount(count);
    } catch {
      // silencio intencional — es indicador, no feature crítico
    }
  };
  fetchCount();
  const handle = setInterval(fetchCount, POLL_MS);
  const onFocus = () => fetchCount();
  window.addEventListener('focus', onFocus);
  return () => {
    cancelled = true;
    clearInterval(handle);
    window.removeEventListener('focus', onFocus);
  };
}, [hasRole]);
```

Reglas:
- **60 segundos** es el intervalo default. Subir a 5min si la API es costosa; nunca bajar de 30s sin razón.
- **`window focus` siempre** — refetch al volver a la pestaña. La sensación de frescura es 80% del valor.
- **Try/catch silencioso** — un indicador no debe gritar errores; sólo no actualiza.
- **Cancellable** — el flag `cancelled` evita setState tras unmount.
- **Condicional al rol** — si `hasRole` es falso, ni siquiera arrancar el intervalo.

Patrón equivalente como hook reutilizable (opcional pero recomendado):

```ts
function useLivePoll<T>(fetcher: () => Promise<T>, options: { ms?: number; enabled?: boolean } = {}) {
  const { ms = 60_000, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const run = async () => {
      try { const v = await fetcher(); if (!cancelled) setData(v); } catch {}
    };
    run();
    const h = setInterval(run, ms);
    const onFocus = () => run();
    window.addEventListener('focus', onFocus);
    return () => { cancelled = true; clearInterval(h); window.removeEventListener('focus', onFocus); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ms]);
  return data;
}
```

---

## F.1.b `KpiCard` — tonos `-strong` para el KPI héroe

**Adición a v2 §F.1.** Cuando una sección tiene 3+ KPIs, **uno** de ellos suele ser el "principal" (el que el usuario realmente vino a ver). Para destacarlo sin romper el layout, usar la variante `-strong`:

| Tone | bg | text | border | Cuándo |
|---|---|---|---|---|
| `gray` | `bg-gray-50` | `text-gray-600` | `border-gray-200` | Default neutro |
| `blue` | `bg-blue-50` | `text-blue-700` | `border-blue-200` | KPI brand secundario |
| `blue-strong` | `bg-blue-100` | `text-blue-800` | `border-blue-300` | **KPI héroe** (Total a pagar, Saldo cartera) |
| `green` | `bg-green-50` | `text-green-700` | `border-green-200` | Métrica positiva consolidada |
| `green-strong` | `bg-green-100` | `text-green-800` | `border-green-300` | Hito alcanzado / SLA cumplido |
| `amber` | `bg-amber-50` | `text-amber-700` | `border-amber-200` | Vigilancia / ligero warning |
| `amber-strong` | `bg-amber-100` | `text-amber-800` | `border-amber-300` | Pendientes que requieren acción |
| `red` | `bg-red-50` | `text-red-700` | `border-red-200` | Riesgo presente |
| `red-strong` | `bg-red-100` | `text-red-800` | `border-red-300` | Riesgo crítico (mora >60d, errores 24h) |

Reglas:
- **Máximo 1 `-strong` por sección de KPIs.** Dos KPIs héroe es ningún KPI héroe.
- **No pintar todo `-strong` por importancia subjetiva.** El `-strong` es el que el usuario mirará primero, no el que más te enorgullece.
- En modo "todo en cero/sin datos", el héroe pierde el `-strong` y vuelve a su tono base — un KPI vacío no debe gritar.

---

## G.1 `EstadoSistemaCard` — quad-estado canónico

**Refinamiento a v2 §G.** El bloque "Estado del sistema" (visible sólo a admin/operadores) debe manejar 4 estados, no asumir "ok":

| Estado | Icono | Tone | Texto |
|---|---|---|---|
| `ok` | `CheckCircle2` | `green` | "Última corrida: {fecha} · OK" |
| `running` | `Loader2` (animate-spin) | `blue` | "Sincronizando ahora…" |
| `failed` | `AlertTriangle` | `red` | "Última corrida falló: {fecha}. {error}" |
| `never_run` | `Clock` | `gray` | "Aún sin corridas registradas." |

```jsx
const STATUS_STYLES = {
  ok:        { bg: 'bg-green-50',  fg: 'text-green-600', icon: 'CheckCircle2' },
  running:   { bg: 'bg-blue-50',   fg: 'text-blue-600',  icon: 'Loader2', spin: true },
  failed:    { bg: 'bg-red-50',    fg: 'text-red-600',   icon: 'AlertTriangle' },
  never_run: { bg: 'bg-gray-100',  fg: 'text-gray-500',  icon: 'Clock' },
};
```

Caso especial de `never_run`: si la integración **no está configurada**, mostrar además un sub-mensaje ámbar `text-[11px] text-amber-700 mt-1` apuntando a la página de configuración:

> "Buk aún no está configurado. Ve a Configuración → Sincronización."

El bloque es **clickable hacia la página de configuración / sync**, no abre modal.

---

## Cómo se compone con v2

- D.1, D.2 → adiciones puras a §D. No invalidan nada.
- E.4 → **OVERRIDE v2 §E.2**: la pill única se desdobla. Apps que ya implementaron la pill v2 deberían migrar (es trabajo de header, contenido de menos de 30 min).
- E.5, F.1.b, G.1 → adiciones puras.

---

## Checklist v2.1 (acumulativo a v1 §15 y v2 §J)

- [ ] Sidebar filtra **secciones completas vacías**, no sólo ítems. (v2.1 §D.1)
- [ ] Items declaran `roles?: Role[]`; secciones nunca declaran roles. (v2.1 §D.2)
- [ ] Header tiene `PendientesPill` separada de `AlertPill` si la app maneja ambos conceptos. (v2.1 §E.4)
- [ ] Indicadores de tiempo real usan poll 60s + refetch en focus + try/catch silencioso. (v2.1 §E.5)
- [ ] Sección de KPIs tiene **a lo más 1** `KpiCard` con tone `-strong`. (v2.1 §F.1.b)
- [ ] `EstadoSistemaCard` maneja `ok / running / failed / never_run`. (v2.1 §G.1)

---

**Versión:** 2.1 · 2026-05
**Apps de referencia v2.1:** ControlCoberturas (canon de header con pendientes + filtrado de secciones), ControlConsumos (canon de pendientes + alertas separadas, KPIs financieros con `-strong`).
