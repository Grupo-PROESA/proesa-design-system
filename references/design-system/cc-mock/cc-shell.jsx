// Shell PROESA: Sidebar (slate-950 con grupos) + Header (BackToPortal + sync + alertas) + AlertDrawer

function Sidebar({ activeRoute = '/', onNavigate, collapsed, onToggleCollapse }) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 transition-all duration-300 relative z-30"
      style={{
        width: collapsed ? 64 : 240,
        background: 'var(--proesa-navy-900)',
        height: '100%',
      }}
    >
      {/* Brand mark — gradient navy→teal alineado con Portal */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
        <div
          className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-white flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--proesa-navy-700) 0%, var(--proesa-teal-600) 100%)',
            boxShadow: '0 8px 16px -6px rgba(20,39,90,0.4)',
          }}
        >
          <Icon name="Landmark" size={16} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden min-w-0">
            <p className="text-white text-sm font-bold leading-tight truncate tracking-tight">Control de Consumos</p>
            <p className="text-[11px] leading-tight" style={{ color: 'var(--proesa-navy-300)', opacity: 0.7 }}>PROESA</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto">
        {window.CC_NAV.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-3' : ''}>
            {group.section && !collapsed && (
              <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {group.section}
              </div>
            )}
            {gi > 0 && <div className="h-px bg-white/[0.06] mx-3 mb-2" />}
            <div className="flex flex-col gap-0.5">
              {group.items.map(item => {
                const isActive = activeRoute === item.to;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate?.(item.to)}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      collapsed ? 'justify-center' : ''
                    } ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                    }`}
                    style={isActive ? {
                      background: 'var(--proesa-navy-700)',
                      boxShadow: '0 4px 8px -2px rgba(20,39,90,0.3)',
                    } : undefined}
                  >
                    <Icon name={item.icon} size={18} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout + footer */}
      <div className="px-2 pb-2">
        <button
          title={collapsed ? 'Cerrar sesión' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-white/[0.06] hover:text-slate-300 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <Icon name="LogOut" size={18} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <p className="text-slate-300 text-[11px] font-medium truncate">{window.CC_USER.nombre}</p>
          <p className="text-slate-500 text-[11px] mt-0.5">PROESA · Control de Consumos</p>
          <p className="text-slate-600 text-[10px] mt-0.5">v2.4.1</p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggleCollapse}
        title={collapsed ? 'Expandir' : 'Colapsar'}
        className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-10 bg-white border border-gray-200 rounded-r-md shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-40"
      >
        <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={12} />
      </button>
    </aside>
  );
}

function BackToPortal() {
  // UX: chip pill que comunica "estás dentro de una app del Portal".
  // Avatar con gradient PROESA navy→teal (mismo del Portal) ancla visual al ecosistema.
  // Caret-back + hover translate-x refuerzan la acción de salida.
  return (
    <a
      href="Portal PROESA.html"
      title="Volver al Portal PROESA"
      className="portal-chip flex-shrink-0"
    >
      <span className="portal-chip__avatar">P</span>
      <Icon name="ChevronLeft" size={12} className="portal-chip__back" />
      <span>Portal</span>
    </a>
  );
}

function SyncStatus({ lastSync }) {
  const ago = formatRelative(lastSync);
  const stale = (Date.now() - new Date(lastSync).getTime()) > 24 * 60 * 60 * 1000;
  return (
    <button
      title={`Última sync: ${new Date(lastSync).toLocaleString('es-MX')}`}
      className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
    >
      <Icon name="Clock" size={12} />
      <span className="hidden md:inline">Última sync:</span>
      <span className="font-medium tabular-nums">{ago}</span>
      {stale && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
    </button>
  );
}

// AlertPill (v2.1 §E.4): solo notificaciones, abre drawer
function AlertPill({ unreadTotal, unreadCritical, onClick }) {
  const cls = unreadCritical > 0
    ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
    : unreadTotal > 0
    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
    : 'text-gray-500 hover:bg-gray-100 border-transparent';
  return (
    <button
      onClick={onClick}
      title={
        unreadCritical > 0
          ? `${unreadCritical} alerta(s) crítica(s)`
          : unreadTotal > 0
          ? `${unreadTotal} alerta(s) sin leer`
          : 'Sin alertas nuevas'
      }
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${cls}`}
    >
      <Icon name="Bell" size={14} />
      {unreadTotal > 0 && <span className="tabular-nums">{unreadTotal}</span>}
      {unreadCritical > 0 && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </button>
  );
}

// PendientesPill (v2.1 §E.4): trabajo operativo, navega
function PendientesPill({ count, onClick }) {
  const has = count > 0;
  return (
    <button
      onClick={onClick}
      title={has ? `${count} cuenta(s) en revisión esperan tu decisión` : 'No tienes pendientes'}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        has
          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
          : 'text-gray-400 hover:bg-gray-50 border-transparent'
      }`}
    >
      <Icon name="ClipboardCheck" size={14} className={has ? 'text-amber-600' : ''} />
      {has
        ? <span><span className="tabular-nums font-semibold">{count}</span> en revisión</span>
        : <span className="hidden sm:inline">Sin pendientes</span>}
      {has && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
      )}
    </button>
  );
}

function Header({ title, subtitle, helpTopic, onAlertClick, alerts, onPendientesClick, pendientesCount }) {
  const unread = alerts.filter(a => !a.leida);
  const unreadCritical = unread.filter(a => a.severidad === 'critical').length;
  return (
    <header
      className="bg-white/80 border-b border-gray-200/60 sticky top-0 z-20 px-6 flex items-center justify-between flex-shrink-0"
      style={{ height: 56, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <BackToPortal />
        <span className="hidden sm:inline-block w-px h-4 bg-gray-200 flex-shrink-0" aria-hidden />
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight truncate">{title}</h1>
          {helpTopic && (
            <button
              className="self-center w-5 h-5 rounded-full inline-flex items-center justify-center text-gray-400 transition-colors flex-shrink-0"
              style={{ '--hover-color': 'var(--proesa-navy-700)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--proesa-navy-700)'; e.currentTarget.style.background = 'var(--proesa-navy-50)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.background = ''; }}
            >
              <Icon name="HelpCircle" size={14} />
            </button>
          )}
          {subtitle && <span className="hidden md:inline text-xs text-gray-400 truncate">{subtitle}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <PendientesPill count={pendientesCount ?? 0} onClick={onPendientesClick} />
        <AlertPill unreadTotal={unread.length} unreadCritical={unreadCritical} onClick={onAlertClick} />
        <SyncStatus lastSync={window.CC_LAST_SYNC} />
        <span className="hidden sm:inline-block w-px h-4 bg-gray-200" aria-hidden />
        <button className="inline-flex items-center gap-2 text-xs">
          <span
            className="w-7 h-7 rounded-full text-white inline-flex items-center justify-center text-[11px] font-semibold"
            style={{ background: 'linear-gradient(135deg, var(--proesa-navy-700) 0%, var(--proesa-teal-600) 100%)' }}
          >RT</span>
          <span className="hidden lg:inline text-gray-700 font-medium">{window.CC_USER.primerNombre}</span>
        </button>
      </div>
    </header>
  );
}

// === AlertaCard refinado (v2 §F.5) ===
const SEVERITY_STYLES = {
  critical: { borderL: 'border-l-red-500',    chipBg: 'bg-red-100',    chipText: 'text-red-700',    icon: 'AlertTriangle' },
  warning:  { borderL: 'border-l-orange-500', chipBg: 'bg-orange-100', chipText: 'text-orange-700', icon: 'AlertCircle' },
  info:     { borderL: 'border-l-[#204590]',  chipBg: 'bg-[#E3EEF8]',  chipText: 'text-[#204590]', icon: 'Info' },
  success:  { borderL: 'border-l-green-500',  chipBg: 'bg-green-100',  chipText: 'text-green-700',  icon: 'CheckCircle2' },
};
function AlertaCard({ alerta, onMarcarLeida }) {
  const s = SEVERITY_STYLES[alerta.severidad] || SEVERITY_STYLES.info;
  return (
    <div className={`bg-white hover:bg-gray-50 border-l-4 ${s.borderL} border-y border-r border-gray-200 rounded-r-lg p-3 relative transition-colors ${alerta.leida ? 'opacity-60' : ''}`}>
      {!alerta.leida && (
        <span
          className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--proesa-teal-600)' }}
          aria-label="No leída"
        />
      )}
      <div className="flex items-start gap-3 pr-4">
        <span className={`w-7 h-7 rounded-md inline-flex items-center justify-center flex-shrink-0 ${s.chipBg} ${s.chipText}`}>
          <Icon name={s.icon} size={14} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">{alerta.titulo}</p>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{alerta.mensaje}</p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-gray-500 truncate">{alerta.cliente}</span>
            <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">{formatRelative(alerta.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// === AlertDrawer (v2 §F.4) ===
function AlertDrawer({ open, onClose, alertas }) {
  const [filter, setFilter] = React.useState('todas');
  const filtered = alertas.filter(a => {
    if (filter === 'no-leidas') return !a.leida;
    if (filter === 'criticas') return a.severidad === 'critical';
    return true;
  });
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col transition-transform duration-200"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Alertas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-gray-100 flex gap-1 flex-shrink-0">
          {[
            { value: 'todas',     label: 'Todas' },
            { value: 'no-leidas', label: 'No leídas' },
            { value: 'criticas',  label: 'Críticas' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                filter === f.value
                  ? 'bg-[#F2F7FC] text-[#204590]'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-500">No hay alertas en este filtro.</div>
          ) : (
            filtered.map(a => <AlertaCard key={a.id} alerta={a} />)
          )}
        </div>
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <button className="w-full text-xs text-gray-500 hover:text-gray-700 py-2 transition-colors">
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  Sidebar, Header, BackToPortal, AlertDrawer, AlertaCard, PendientesPill, AlertPill,
});
