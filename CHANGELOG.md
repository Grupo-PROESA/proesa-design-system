# Changelog

Todos los cambios notables a este paquete se documentan aquí. Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Versionado: [SemVer](https://semver.org/lang/es/).

## [Unreleased]

### Añadido

- **`AuthProvider` — props `appCode` y `logoutUrl`** (`src/components/auth/AuthContext.tsx`):
  - `appCode?: string` — si se pasa, el redirect en 401 va al path canónico del
    gateway `${portalUrl}/apps/${appCode}/launch?return_to=...`. Antes había que
    pre-construir `portalUrl` con el prefix `/apps/<code>` manualmente, lo que
    tenía side effects en `<PortalChip/>` y `logout()`. Ahora `portalUrl` puede ser
    la raíz del portal y `appCode` se compone en el redirect.
  - `logoutUrl?: string` — sobreescribe la URL de logout. Default cambiado a
    `${portalUrl}/auth/logout` para cerrar la sesión del portal junto con la
    local (antes iba a `${portalUrl}` raíz, lo que solo llevaba al dashboard sin
    cerrar sesión — patrón que apps existentes evitaban implementando su propio
    AuthContext; ahora estandarizado en el paquete).

### Cambiado

- **Default de `logout()` ahora va a `${portalUrl}/auth/logout`** cuando hay
  `portalUrl`. Antes iba a `${portalUrl}` raíz. Apps que quieran preservar el
  comportamiento anterior (logout sin cerrar sesión del portal) deben pasar
  `logoutUrl={portalUrl}` explícito.

### Migración para apps existentes

- Apps que pre-construyen `portalUrl` con el prefix
  (`https://portal.grupoproesa.mx/apps/<code>` — patrón observado en Cotizador
  y GestionLogistica): migrar a `portalUrl="https://portal.grupoproesa.mx"`
  + `appCode="<code>"`. Limpia los workarounds en `App.tsx` y elimina los side
  effects sobre `<PortalChip/>`/logout.
- Apps que pasen `portalUrl` raíz sin `appCode` (patrón observado en
  GestionCostos): el redirect 401 seguía cayendo en `${portalUrl}/launch` (404).
  Agregar `appCode="<internal_code>"` para resolver.
- Apps que reimplementan AuthContext propio (PurchasePlanning, ControlCoberturas):
  pueden migrar al del paquete pasando `appCode` + `logoutUrl` apropiados, o
  mantenerse en su propia implementación sin cambios.

## [0.1.0] — 2026-05-04

Primera versión del paquete. Consolida v1.0 → v2.2 del UI-PATTERN en una sola fuente de verdad y empaqueta los componentes canónicos.

### Añadido

- **Tokens** (`tokens/proesa.css`): paleta navy + teal alineada al Portal, tipografía Source Sans 3, gradient brand invariable, radii, shadows, clase `.portal-chip`.
- **Preset Tailwind v4** (`src/preset.css`): expone los tokens como utilidades `bg-proesa-navy-*`, `text-proesa-teal-*`, etc.
- **Layout**: `Layout`, `Sidebar` (navy-900, secciones, filtrado por rol), `Header` (PortalChip + slots derecha), `BrandMark`, `PortalChip`.
- **Auth**: `AuthProvider`, `useAuth`, `ProtectedRoute`, `LoginPage` (template).
- **UI primitivos**: `Button`, `Card`, `Badge`, `Modal`, `ConfirmModal`, `Toast`, `Spinner`, `HelpButton`, `HelpPopover`, `Field`, `INPUT_CLASS`.
- **Datos**: `KpiCard` (con tonos `-strong`), `ActionTile`, `MoneyCell`, `EstadoSistemaCard` (quad-state), `FilterPills`, `DataTable`.
- **Notifications** (opt-in): `PendientesPill`, `AlertPill`, `AlertDrawer`, `AlertaCard`, `SyncStatus`.
- **Domain** (opt-in, financiero): `RiskBadge`, `AgingBar`.
- **Hooks**: `useToast`, `useApi`, `useLivePoll`.
- **Utils**: `formatDateMx`, `formatDateTimeMx`, `todayMxISO`, `formatRelative`, `formatMoneyMx`, `formatNumberMx`, `formatPercentMx`, `apiClient`.
- **Templates**: `DashboardTemplate` con saludo + KPIs + acciones rápidas.
- **Docs**: UI-PATTERN consolidado, voz y tono, iconografía, auth/SSO, deploy.
- **BOOTSTRAP.md** y **MIGRATION.md** orientados a Claude Code.

### Gaps conocidos

- Sin Storybook ni demo navegable (decisión consciente; el patrón se explica con docs).
- Sin tests unitarios (los componentes son chrome visual; auditoría visual se hace consumiendo en una app real).
- `apiClient` es una base mínima — cada app extiende su `services/api.ts` propio.

### Histórico previo (preservado en `references/`)

- v1.0 (2026-04): primera publicación del UI-PATTERN.
- v2.0 (2026-05): patrón de escalado de marca + componentes financieros.
- v2.1 (2026-05): `PendientesPill` separado de `AlertPill`, `useLivePoll`, tonos `-strong`.
- v2.2 (2026-05): tokens del Portal obligatorios, `PortalChip`, gradient brand invariable.

Ver `references/design-system/pattern_docs/` para los documentos originales.
