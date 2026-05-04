# Iconografía · Lucide curado

Toda mini-app PROESA usa **`lucide-react`** como única fuente de iconos. Nada de Heroicons, FontAwesome, Material Icons, ni iconos propios SVG.

## Reglas

- **Stroke default** (1.5-2px). No mezclar con iconos rellenos.
- Tamaño en línea de texto: `size={14}` o `size={16}`.
- En cards y headers: `size={18}`.
- En tiles y KPIs: `size={18}`.
- En el brand mark: `size={16}`.
- Color: heredado del padre via `currentColor`. No hardcodear.

## Iconos por dominio (canónicos)

Cuando dos apps necesitan el mismo concepto, deben usar el mismo icono. Tabla de referencia:

### Acciones

| Concepto | Icono Lucide |
|---|---|
| Crear / nuevo | `Plus`, `FilePlus` |
| Editar | `Pencil` |
| Eliminar | `Trash2` |
| Aprobar / decisión positiva | `CheckSquare`, `CheckCircle2` |
| Rechazar | `XSquare`, `XCircle` |
| Volver | `ArrowLeft` |
| Cerrar | `X` |
| Cancelar | `Ban` |
| Confirmar | `Check` |
| Buscar | `Search` |
| Filtrar | `Filter`, `SlidersHorizontal` |
| Descargar | `Download` |
| Subir / cargar archivo | `Upload`, `UploadCloud` |
| Refrescar | `RefreshCw` |
| Más opciones | `MoreHorizontal`, `MoreVertical` |
| Compartir | `Share2` |

### Navegación / chrome

| Concepto | Icono Lucide |
|---|---|
| Inicio / dashboard | `LayoutDashboard` |
| Configuración | `Settings`, `Settings2` |
| Ayuda | `HelpCircle` |
| Notificación | `Bell` |
| Pendientes / cola de tareas | `ClipboardCheck`, `ListChecks` |
| Reportes / Excel | `FileSpreadsheet` |
| Sync / tiempo | `Clock`, `RefreshCw` |
| Cerrar sesión | `LogOut` |
| Colapsar sidebar | `ChevronLeft`, `PanelLeftClose` |
| Expandir sidebar | `ChevronRight`, `PanelLeftOpen` |
| Caret de chip | `ChevronLeft` (12px) |

### Estados / severidad

| Concepto | Icono Lucide |
|---|---|
| Éxito / OK | `CheckCircle2` |
| Cargando / running | `Loader2` (con `animate-spin`) |
| Crítico / falla | `AlertTriangle` |
| Advertencia | `AlertCircle` |
| Información | `Info` |
| Sin datos / nunca corrió | `Clock` |

### Datos

| Concepto | Icono Lucide |
|---|---|
| Listado propio | `ListChecks` |
| Tabla / spreadsheet | `Table`, `FileSpreadsheet` |
| Gráfica / análisis | `BarChart3`, `LineChart`, `TrendingUp` |
| KPI numérico | depende del dominio (ver abajo) |
| Calendario / fecha | `Calendar` |
| Hora | `Clock` |
| Subida (delta positivo) | `ArrowUp`, `TrendingUp` |
| Bajada (delta negativo) | `ArrowDown`, `TrendingDown` |

### Brand mark por tipo de app

El icono del brand mark debe ser **representativo del dominio**, no genérico.

| Tipo de app | Icono brand sugerido |
|---|---|
| Cobertura / seguros / aprobaciones de límite | `Shield`, `ShieldCheck` |
| Compras / aprovisionamiento | `ShoppingCart` |
| Crédito / cartera / cobranza | `Landmark`, `CircleDollarSign` |
| Laboratorio / operaciones clínicas | `Microscope`, `Activity`, `Beaker` |
| Reporting / BI | `BarChart3` |
| Recursos humanos | `Users` |
| Inventarios | `Boxes`, `Package` |
| Documentos / contratos | `FileText`, `Files` |
| Procesos automatizados / batch | `Cog`, `Cpu` |
| Portal / launcher | `LayoutGrid` |

### Roles / personas

| Concepto | Icono Lucide |
|---|---|
| Usuario individual | `User`, `UserCircle` |
| Equipo / grupo | `Users` |
| Admin | `ShieldCheck`, `KeyRound` |
| Cliente externo | `Building2` |
| Paciente | `UserSquare2` |

### Comunicación

| Concepto | Icono Lucide |
|---|---|
| Email | `Mail` |
| Teléfono | `Phone` |
| Chat | `MessageSquare`, `MessageCircle` |
| Notificación push | `Bell` |
| Comentario | `MessageSquareText` |

---

## Anti-patrones

- ❌ Mezclar Lucide con otra librería.
- ❌ Iconos rellenos (`Filled`, `Solid` variants). Solo stroke.
- ❌ Cambiar el `strokeWidth` por icono. Si necesitas ajustar peso visual, cambia el tamaño.
- ❌ Color hardcodeado en el icono (`color="#204590"`). Heredar via `currentColor`.
- ❌ Iconos de marca / logos como icono de UI. Si necesitas un logo de marca externa, usa `<img>`.
- ❌ Iconos como única señal de estado. Acompaña siempre con texto o aria-label.

---

## Cómo proponer un icono nuevo

Si un dominio nuevo necesita un icono brand y no aparece en la tabla:

1. Buscar en [lucide.dev](https://lucide.dev) un símbolo natural del dominio.
2. Documentarlo en este archivo via PR.
3. Discutirlo en `docs/adr/` si es controversial (ej: dos dominios pelean por el mismo icono).

No inventar iconos propios SVG salvo que no exista alternativa Lucide razonable.
