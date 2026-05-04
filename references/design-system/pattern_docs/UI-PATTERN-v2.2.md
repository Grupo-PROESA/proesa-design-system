# Patrón UI · Mini-apps del Ecosistema PROESA — v2.2

> **Esta es una extensión incremental de [UI-PATTERN-v2.1.md](./UI-PATTERN-v2.1.md), no un reemplazo.**
> Toda regla v1.0 / v2.0 / v2.1 sigue vigente. v2.2 captura **3 hallazgos** que emergieron al revisar la coherencia visual entre el Portal/gateway y las mini-apps.
>
> **Cambios principales vs v2.1:**
> 1. §B.1 — **Tokens de color obligatorios** alineados al Portal PROESA. Prohibido usar paleta Tailwind cruda (`slate-*`, `blue-*`) para superficies brand.
> 2. §C.1 — **Mark de la app en el sidebar** debe usar el gradient PROESA `navy-700 → teal-600`, mismo del Portal. Sin excepciones de paleta.
> 3. §E.6 — **`PortalChip`**: nuevo patrón canónico para el "regreso al Portal" en el header. Reemplaza el texto/flecha simple de v2.

---

## B.1 Tokens de color — alineación obligatoria con el Portal

**OVERRIDE v1 §3 y v2 §B.** v1 y v2 toleraban Tailwind crudo (`slate-950`, `blue-600`) en superficies de chrome. Auditoría visual contra el Portal PROESA mostró que esto produce mini-apps **visualmente desconectadas del ecosistema**: cada app se siente como un producto distinto, no como un módulo de PROESA.

A partir de v2.2, las mini-apps **deben** consumir los tokens del archivo `assets/colors_and_type.css` del Portal, ya sea importándolo directamente o replicando el bloque `:root` en su propio CSS:

```css
:root {
  /* PROESA navy — wordmark, sidebar, primary actions */
  --proesa-navy-900: #14275A;
  --proesa-navy-800: #1B3373;
  --proesa-navy-700: #204590;   /* PRIMARY brand */
  --proesa-navy-500: #4B86C7;
  --proesa-navy-300: #8CC4EA;
  --proesa-navy-200: #BFDBF1;
  --proesa-navy-100: #E3EEF8;
  --proesa-navy-50:  #F2F7FC;

  /* PROESA teal — accent, success, brand mark gradient */
  --proesa-teal-700: #2C8A7A;
  --proesa-teal-600: #37A992;   /* PRIMARY accent */
  --proesa-teal-500: #41B292;
  --proesa-teal-300: #7BC4B0;
  --proesa-teal-100: #E2F2EC;

  /* Neutrals */
  --proesa-mist:  #F4F6FA;       /* canvas/body bg */
  --proesa-fog:   #E7EAF1;       /* borders */
  --proesa-ink:   #0F1626;       /* primary text */
}
```

### Mapeo Tailwind → PROESA (sustitución 1:1)

Donde tu app usa hoy paleta Tailwind, sustituir así. Esta tabla cubre **superficies de chrome** (sidebar, header, login, primary CTAs, KPIs azules). En el contenido de tabla y data-viz se conservan los semánticos (verde/ámbar/rojo de v1 §3).

| Uso | Tailwind v1/v2 | PROESA v2.2 |
|---|---|---|
| Sidebar background | `bg-slate-950` / `#020617` | `var(--proesa-navy-900)` |
| Sidebar item activo | `bg-blue-600` | `var(--proesa-navy-700)` |
| Sidebar item activo (sombra) | `rgba(37,99,235,0.2)` | `rgba(20,39,90,0.3)` |
| Body / canvas | `bg-slate-100` / `#f1f5f9` | `var(--proesa-mist)` (`#F4F6FA`) |
| Borders | `border-gray-200` | `var(--proesa-fog)` (sigue siendo gris-200 visual) |
| Primary CTA | `bg-blue-600 hover:bg-blue-700` | `background: var(--proesa-navy-700)` (hover → `--proesa-navy-800`) |
| KPI tone `blue` (border) | `border-blue-200` | `border-[#BFDBF1]` |
| KPI tone `blue` (bg) | `bg-blue-50` | `bg-[#F2F7FC]` |
| KPI tone `blue` (text) | `text-blue-700` | `text-[#204590]` |
| KPI tone `blue-strong` (border) | `border-blue-300` | `border-[#8CC4EA]` |
| KPI tone `blue-strong` (bg) | `bg-blue-100` | `bg-[#E3EEF8]` |
| KPI tone `blue-strong` (text) | `text-blue-800` | `text-[#14275A]` |
| Badge `info` | `bg-sky-100 text-sky-800` | `bg-[#E3EEF8] text-[#204590]` |
| Filtro activo (chip) | `bg-blue-50 text-blue-700` | `bg-[#F2F7FC] text-[#204590]` |
| Avatar usuario | `from-blue-500 to-blue-600` | `from var(--proesa-navy-700) to var(--proesa-teal-600)` |
| Login background | `from-slate-900 via-slate-950 to-blue-950` | `from var(--proesa-navy-900) via var(--proesa-navy-800) to var(--proesa-teal-900)` |

> **Tip de implementación.** En JSX donde Tailwind no permite tokens dinámicos, usar `style={{ background: 'var(--proesa-navy-700)' }}` o sintaxis arbitraria `bg-[#204590]`. El primero es preferible (un solo lugar de verdad).
>
> **Trampa de Chromium.** Los gradientes `linear-gradient(... var(--x) 0%, var(--y) 55%, ...)` con paradas porcentuales explícitas y `var()` **deben** usar `backgroundImage:` longhand, no `background:` shorthand. Chromium ignora silenciosamente el shorthand en este caso y deja la superficie transparente.

### Tonos semánticos (verde/ámbar/rojo) — sin cambios

Los tonos semánticos de KpiCard (`green`, `amber`, `red`, y sus `-strong`) se mantienen en Tailwind nativo. Son colores **funcionales**, no brand. Cambiarlos los acercaría peligrosamente al teal corporativo y rompería el contrato semántico.

---

## C.1 Brand mark de la app — gradient PROESA

**Adición a v2 §C.** El cuadrado del logo en el sidebar (esquina superior izquierda) **debe** usar el gradient brand del Portal:

```jsx
<div
  className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-white"
  style={{
    background: 'linear-gradient(135deg, var(--proesa-navy-700) 0%, var(--proesa-teal-600) 100%)',
    boxShadow: '0 8px 16px -6px rgba(20,39,90,0.4)',
  }}
>
  <Icon name={brandIcon} size={16} />
</div>
```

Reglas:
- **El gradient es invariable.** No customizar por app. Es la firma visual del ecosistema.
- **El icono sí cambia** por app (ControlCoberturas → `Shield`, ControlConsumos → `Landmark`, etc.). Lucide siempre.
- El mismo gradient se usa en: avatar de usuario en el header, brand mark del Login, y `PortalChip__avatar` (§E.6).
- **No usar `from-blue-500 to-blue-600`** ni variantes Tailwind. Es una de las marcas más reconocibles del Portal.

---

## E.6 `PortalChip` — regreso al Portal

**OVERRIDE v2 §E.1.** v2 proponía un texto plano `← Portal PROESA` a la izquierda del título. En testing visual con usuarios internos resultó **invisible**: se confundía con el título de la página. La versión 2.2 lo eleva a un componente reconocible que comunica tres cosas a la vez:

1. "Estás dentro de una app del ecosistema PROESA"
2. "El Portal es tu salida / tu casa"
3. "Click aquí te lleva ahí"

### Diseño canónico

```jsx
// portal-chip.jsx
function PortalChip() {
  return (
    <a
      href="/portal"  // o ruta equivalente al gateway
      title="Volver al Portal PROESA"
      className="portal-chip flex-shrink-0"
    >
      <span className="portal-chip__avatar">P</span>
      <Icon name="ChevronLeft" size={12} className="portal-chip__back" />
      <span>Portal</span>
    </a>
  );
}
```

```css
.portal-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  border-radius: 999px;
  background: var(--proesa-navy-50);
  border: 1px solid var(--proesa-navy-100);
  color: var(--proesa-navy-700);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: all 180ms ease;
  text-decoration: none;
  cursor: pointer;
}
.portal-chip:hover {
  background: var(--proesa-navy-100);
  border-color: var(--proesa-navy-200);
  transform: translateX(-1px);  /* nudge hacia "atrás" */
}
.portal-chip__avatar {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--proesa-navy-700) 0%, var(--proesa-teal-600) 100%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.portal-chip__back {
  opacity: 0.6;
  transition: opacity 180ms;
}
.portal-chip:hover .portal-chip__back { opacity: 1; }
```

### Anatomía

```
┌─────────────────────────┐
│  ⓟ  ‹  Portal           │
│  ▲   ▲    ▲              │
│  │   │    └─ Etiqueta corta — NUNCA "Portal PROESA" entero, redunda con el avatar
│  │   └────── Caret-back (12px, opacity 0.6 → 1.0 en hover) — telegrafía "salida"
│  └────────── Avatar circular con gradient navy→teal y letra "P" — ancla visual al ecosistema
└─────────────────────────┘
```

### Reglas

- **Posición fija:** primer elemento del header, alineado a la izquierda. Antes del separador y antes del título.
- **Hover translate-x:** `translateX(-1px)` refuerza la dirección "regreso". No animar más; es chrome, no juguete.
- **No mostrar el nombre de la app dentro del chip.** El usuario ya sabe en qué app está; el chip dice de dónde **vino**.
- **Si la mini-app se abre directo (no vía Portal):** el chip sigue presente; `href` apunta al Portal estático. Es un "ir al Portal", no un "volver".
- **Mobile (<640px):** ocultar el texto "Portal", dejar `[avatar][caret]` solamente. El title-attr sigue ahí para accesibilidad.

### Antipatrones

| ❌ No | ✅ Sí |
|---|---|
| `← Portal PROESA` texto plano | `PortalChip` con avatar + caret + "Portal" |
| Botón ghost gris hover azul | Pill con avatar gradient permanente |
| Lleno con label largo "Volver al Portal PROESA" | Label corto "Portal" + tooltip |
| Icono `ArrowLeft` 16px solo | Caret 12px **acompañado** del avatar |
| Compite con el título | Visualmente subordinado al título (font-size 11px, peso 600) |

---

## Cómo se compone con v2 / v2.1

- B.1 → **OVERRIDE** parcial sobre Tailwind crudo en chrome. Las apps existentes deben migrar `slate-*` y `blue-*` de superficies brand a tokens PROESA. Trabajo concentrado en sidebar + header + login + primary CTA + KPIs azules. KPIs semánticos (verde/ámbar/rojo) **no migran**.
- C.1 → adición pura.
- E.6 → **OVERRIDE v2 §E.1**. La flecha+texto se reemplaza por `PortalChip`.

---

## Checklist v2.2 (acumulativo a v1 §15, v2 §J, v2.1)

- [ ] El bloque `:root` con tokens PROESA está en CSS (importado o replicado). (v2.2 §B.1)
- [ ] Sidebar usa `var(--proesa-navy-900)`, no `slate-950` ni hex hardcoded. (v2.2 §B.1)
- [ ] Item activo del sidebar usa `var(--proesa-navy-700)`, no `blue-600`. (v2.2 §B.1)
- [ ] Primary CTA es navy-700, hover navy-800. No `bg-blue-600`. (v2.2 §B.1)
- [ ] Avatar de usuario en el header usa gradient `navy-700 → teal-600`. (v2.2 §B.1, §C.1)
- [ ] Login usa gradient `navy-900 → navy-800 → teal-900` con `backgroundImage:` longhand. (v2.2 §B.1)
- [ ] El brand mark del sidebar usa el gradient invariable PROESA. (v2.2 §C.1)
- [ ] Header tiene `PortalChip` como primer elemento, no texto plano. (v2.2 §E.6)
- [ ] El `PortalChip` esconde su label en mobile y conserva el title-attr. (v2.2 §E.6)
- [ ] KPIs azules usan los hex PROESA `#204590` / `#E3EEF8`, no `blue-700` / `blue-100`. (v2.2 §B.1)

---

**Versión:** 2.2 · 2026-05
**Apps de referencia v2.2:** ControlConsumos (canon de alineación al Portal — sidebar navy-900, brand mark navy→teal, PortalChip en header, KPIs migrados a hex PROESA, login con gradient corporativo).
