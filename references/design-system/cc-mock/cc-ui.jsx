// Componentes UI canónicos PROESA v1+v2 — usados por todas las pantallas del mockup CC

// === Iconos Lucide via global window.lucide (CDN) ===
function Icon({ name, size = 16, className = '', strokeWidth = 2 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = '';
      const svg = window.lucide.createElement(window.lucide.icons[name] || window.lucide.icons.HelpCircle);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('stroke-width', strokeWidth);
      svg.setAttribute('class', className);
      ref.current.appendChild(svg);
    }
  }, [name, size, className, strokeWidth]);
  return <span ref={ref} className="inline-flex flex-shrink-0" style={{ width: size, height: size }} />;
}

// === Format helpers ===
const formatMoney = (amount, opts = {}) => {
  const { maxDigits = 0 } = opts;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: maxDigits,
  }).format(amount ?? 0);
};
const formatNumber = (n) => new Intl.NumberFormat('es-MX').format(n ?? 0);
const formatPercent = (n) => `${(n ?? 0).toFixed(1)}%`;

const formatRelative = (iso) => {
  const d = new Date(iso);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'ayer';
  if (diffD < 7) return `hace ${diffD}d`;
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
};

// === Card ===
function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>;
}
function CardHeader({ title, subtitle, helpTopic, actions }) {
  return (
    <div className="flex justify-between items-start gap-4 p-5 border-b border-gray-100">
      <div className="min-w-0 flex items-start gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {helpTopic && (
          <button className="w-6 h-6 rounded-full inline-flex items-center justify-center text-gray-500 transition-colors flex-shrink-0" onMouseEnter={e => { e.currentTarget.style.color = 'var(--proesa-navy-700)'; e.currentTarget.style.background = 'var(--proesa-navy-50)'; }} onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = ''; }}>
            <Icon name="HelpCircle" size={16} />
          </button>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

// === Button ===
function Button({ children, variant = 'primary', size = 'md', leftIcon, loading, disabled, onClick, type = 'button', className = '' }) {
  // PROESA navy primary; styles inline para escapar Tailwind palette.
  const variantClass = {
    primary: 'text-white shadow-sm',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
    outline: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm',
  };
  const variantStyle = variant === 'primary'
    ? { background: 'var(--proesa-navy-700)' }
    : undefined;
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={variantStyle}
      onMouseEnter={variant === 'primary' ? e => e.currentTarget.style.background = 'var(--proesa-navy-800)' : undefined}
      onMouseLeave={variant === 'primary' ? e => e.currentTarget.style.background = 'var(--proesa-navy-700)' : undefined}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${variantClass[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <Icon name="Loader2" size={16} className="animate-spin" /> : leftIcon}
      {children}
    </button>
  );
}

// === Badge ===
function Badge({ children, variant = 'neutral' }) {
  const variants = {
    default: 'bg-[#E3EEF8] text-[#204590]',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-[#E3EEF8] text-[#204590]',
    neutral: 'bg-gray-100 text-gray-700',
  };
  return <span className={`inline-flex items-center font-medium rounded-full px-2 py-0.5 text-xs ${variants[variant]}`}>{children}</span>;
}

// === RiskBadge (v2 §F.2) ===
const RISK_CONFIG = {
  verde:    { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500',  label: 'Al corriente' },
  amarillo: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: 'Vigilar' },
  naranja:  { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500', label: 'Riesgo' },
  rojo:     { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500',    label: 'Crítico' },
};
function RiskBadge({ category, score, size = 'sm' }) {
  const c = RISK_CONFIG[category] || RISK_CONFIG.verde;
  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${c.bg}`}>
        <span className={`w-3 h-3 rounded-full ${c.dot}`} />
        <span className={`font-bold ${c.text}`}>{score?.toFixed(0)} · {c.label}</span>
      </div>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}

// === KpiCard (v2 §F.1) ===
function KpiCard({ label, value, format = 'number', delta, deltaLabel, deltaPositive = 'good', tone = 'gray', icon, hint, to, onClick }) {
  const tones = {
    gray:   { border: 'border-gray-200',  iconBg: 'bg-gray-50',     iconText: 'text-gray-600',  valueText: 'text-gray-900' },
    blue:   { border: 'border-[#BFDBF1]', iconBg: 'bg-[#F2F7FC]', iconText: 'text-[#204590]', valueText: 'text-[#204590]' },
    'blue-strong':  { border: 'border-[#8CC4EA]', iconBg: 'bg-[#E3EEF8]', iconText: 'text-[#14275A]', valueText: 'text-[#14275A]' },
    green:  { border: 'border-green-200', iconBg: 'bg-green-50',    iconText: 'text-green-700', valueText: 'text-green-700' },
    'green-strong': { border: 'border-green-300', iconBg: 'bg-green-100', iconText: 'text-green-800', valueText: 'text-green-800' },
    amber:  { border: 'border-amber-200', iconBg: 'bg-amber-50',    iconText: 'text-amber-700', valueText: 'text-amber-700' },
    'amber-strong': { border: 'border-amber-300', iconBg: 'bg-amber-100', iconText: 'text-amber-800', valueText: 'text-amber-800' },
    red:    { border: 'border-red-200',   iconBg: 'bg-red-50',      iconText: 'text-red-700',   valueText: 'text-red-700' },
    'red-strong':   { border: 'border-red-300',   iconBg: 'bg-red-100',   iconText: 'text-red-800',   valueText: 'text-red-800' },
  };
  const t = tones[tone] || tones.gray;
  const formattedValue =
    format === 'currency' ? formatMoney(value) :
    format === 'percent'  ? formatPercent(value) :
    formatNumber(value);

  // Delta interpretation
  let deltaColor = 'text-gray-500';
  let deltaIcon = null;
  if (delta != null) {
    const isUp = delta > 0;
    const isFavorable =
      (isUp && deltaPositive === 'good') ||
      (!isUp && deltaPositive === 'bad');
    deltaColor = isFavorable ? 'text-green-700' : 'text-red-700';
    deltaIcon = isUp ? 'ArrowUp' : 'ArrowDown';
  }

  const inner = (
    <div className={`block bg-white rounded-xl border ${t.border} shadow-sm p-4 hover:shadow-md transition-shadow text-left w-full`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        {icon && (
          <span className={`w-7 h-7 rounded-md inline-flex items-center justify-center ${t.iconBg} ${t.iconText}`}>
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      <div className={`text-2xl font-semibold tabular-nums leading-tight ${t.valueText}`}>{formattedValue}</div>
      {delta != null && (
        <div className={`mt-1.5 flex items-center gap-1 text-xs ${deltaColor}`}>
          <Icon name={deltaIcon} size={12} />
          <span className="tabular-nums font-medium">{Math.abs(delta).toFixed(1)}%</span>
          {deltaLabel && <span className="text-gray-500 font-normal">· {deltaLabel}</span>}
        </div>
      )}
      {hint && !delta && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
  );
  return to || onClick ? <button onClick={onClick} className="block w-full text-left">{inner}</button> : inner;
}

// === ActionTile ===
function ActionTile({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 flex items-center gap-3 hover:border-[#BFDBF1] hover:bg-[#F2F7FC]/40 transition-colors text-left w-full"
    >
      <span className="w-8 h-8 rounded-lg bg-[#F2F7FC] text-[#204590] inline-flex items-center justify-center flex-shrink-0">
        <Icon name={icon} size={18} />
      </span>
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </button>
  );
}

// === AgingBar (v2 §F.3) ===
function AgingBar({ buckets, total, compact = false }) {
  if (!total) return null;
  return (
    <div className={compact ? 'space-y-1.5' : 'space-y-3'}>
      <div className={`flex ${compact ? 'h-1.5' : 'h-3'} rounded-full overflow-hidden bg-gray-100`}>
        {buckets.map(b => {
          const pct = (b.amount / total) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={b.key}
              className={`${b.color} transition-all`}
              style={{ width: `${pct}%` }}
              title={`${b.label}: ${formatMoney(b.amount)} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
          {buckets.map(b => (
            <div key={b.key} className="inline-flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${b.color} flex-shrink-0`} />
              <span className="text-gray-500">{b.label}</span>
              <span className="text-gray-900 font-medium tabular-nums">{formatMoney(b.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// === MoneyCell (v2 §F.7) ===
function MoneyCell({ amount, negative = false, muted = false, className = '' }) {
  const isZero = amount === 0;
  const cls =
    isZero || muted ? 'text-gray-400' :
    negative || amount < 0 ? 'text-red-700' :
    'text-gray-900';
  const display = (negative || amount < 0)
    ? `(${formatMoney(Math.abs(amount))})`
    : formatMoney(amount);
  return <span className={`font-mono tabular-nums text-sm ${cls} ${className}`}>{display}</span>;
}

// === HelpPopover (v2 §F.6) ===
function HelpPopover({ title, description, formula, ranges }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  return (
    <span className="relative inline-block" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="ml-1 w-4 h-4 inline-flex items-center justify-center rounded-full bg-gray-300 text-gray-600 text-[10px] font-bold hover:bg-gray-400 hover:text-white transition-colors leading-none"
      >i</button>
      {open && (
        <span className="absolute z-50 left-0 top-6 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-left block">
          <span className="font-semibold text-gray-900 text-sm mb-1 block">{title}</span>
          <span className="text-xs text-gray-600 mb-2 block leading-relaxed">{description}</span>
          {formula && (
            <span className="bg-gray-50 rounded p-2 mb-2 block">
              <span className="text-[10px] text-gray-400 uppercase font-medium mb-1 block tracking-wider">Fórmula</span>
              <span className="text-xs text-gray-800 font-mono block">{formula}</span>
            </span>
          )}
          {ranges && ranges.length > 0 && (
            <span className="block space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-medium block tracking-wider">Interpretación</span>
              {ranges.map((r, i) => (
                <span key={i} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${r.color}`} />
                  <span className="text-gray-700">{r.label}</span>
                </span>
              ))}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

// Expose globals para los otros scripts
Object.assign(window, {
  Icon, Card, CardHeader, CardBody, Button, Badge, RiskBadge, KpiCard, ActionTile,
  AgingBar, MoneyCell, HelpPopover,
  formatMoney, formatNumber, formatPercent, formatRelative, RISK_CONFIG,
});
