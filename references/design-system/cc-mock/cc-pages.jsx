// Páginas del mockup ControlConsumos PROESA-fied: Login, Inicio, Crédito

// === LOGIN (v1 §7 + v2 §I) ===
function LoginPage() {
  return (
    <div
      className="min-h-full flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage: 'linear-gradient(135deg, var(--proesa-navy-900) 0%, var(--proesa-navy-800) 55%, var(--proesa-teal-900) 100%)',
      }}
    >
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl inline-flex items-center justify-center mx-auto mb-4 text-white"
            style={{
              background: 'linear-gradient(135deg, var(--proesa-navy-700) 0%, var(--proesa-teal-600) 100%)',
              boxShadow: '0 10px 25px -5px rgba(20,39,90,0.5)',
            }}
          >
            <Icon name="Landmark" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Control de Consumos</h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--proesa-navy-300)' }}>PROESA · Ingresa con tu cuenta corporativa</p>
        </div>
        <form className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              defaultValue="rtapia"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--proesa-navy-500)' }}
              placeholder="Tu usuario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              defaultValue="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--proesa-navy-500)' }}
              placeholder="Tu contraseña"
            />
          </div>
          <button
            type="button"
            className="w-full py-2.5 px-4 text-sm font-medium rounded-lg text-white transition-colors shadow-sm"
            style={{ background: 'var(--proesa-navy-700)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--proesa-navy-800)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--proesa-navy-700)'}
          >
            Ingresar
          </button>
          <div className="text-center">
            <a href="#" className="text-xs text-gray-500 transition-colors" onMouseEnter={e => e.currentTarget.style.color = 'var(--proesa-navy-700)'} onMouseLeave={e => e.currentTarget.style.color = ''}>¿Olvidaste tu contraseña?</a>
          </div>
        </form>
        <p className="text-center text-[11px] mt-6" style={{ color: 'var(--proesa-navy-300)', opacity: 0.7 }}>PROESA · Plataforma interna · v2.4.1</p>
      </div>
    </div>
  );
}

// === INICIO (v2 §G — obligatorio) ===
function InicioPage() {
  const u = window.CC_USER;
  return (
    <div className="max-w-5xl flex flex-col gap-5">
      {/* Saludo */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">Hola, {u.primerNombre} 👋</h2>
              <p className="text-sm text-gray-500 mt-1">Tienes <span className="font-medium text-gray-900">7 cuentas en revisión</span> y <span className="font-medium text-red-700">2 alertas críticas</span> hoy.</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {u.roles.map(r => <Badge key={r} variant="neutral">{r}</Badge>)}
              </div>
            </div>
            <a href="#" className="text-xs text-gray-500 inline-flex items-center gap-1.5 flex-shrink-0 transition-colors" onMouseEnter={e => e.currentTarget.style.color = 'var(--proesa-navy-700)'} onMouseLeave={e => e.currentTarget.style.color = ''}>
              <Icon name="HelpCircle" size={14} />
              Centro de ayuda
            </a>
          </div>
        </CardBody>
      </Card>

      {/* KPIs */}
      <section>
        <h3 className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-3">Tu actividad</h3>
        <div className="grid grid-cols-3 gap-3">
          {window.CC_KPIS_INICIO.map(k => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>
      </section>

      {/* Aging del portafolio */}
      <section>
        <h3 className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-3">Antigüedad del portafolio</h3>
        <Card>
          <CardBody>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">Saldo total</p>
                <p className="text-2xl font-semibold text-gray-900 tabular-nums">{formatMoney(window.CC_AGING.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">% en mora</p>
                <p className="text-base font-semibold text-amber-700 tabular-nums">25.0%</p>
              </div>
            </div>
            <AgingBar buckets={window.CC_AGING.buckets} total={window.CC_AGING.total} />
          </CardBody>
        </Card>
      </section>

      {/* Estado del sistema */}
      <section>
        <h3 className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-3">Estado del sistema</h3>
        <Card>
          <CardBody className="grid grid-cols-3 gap-4">
            {window.CC_SISTEMA.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-md bg-green-50 text-green-700 inline-flex items-center justify-center flex-shrink-0">
                  <Icon name={s.icon} size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500">{s.label}</p>
                  <p className="text-sm font-semibold text-gray-900 tabular-nums">{s.value}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      {/* Acciones rápidas */}
      <section>
        <h3 className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-3">Acciones rápidas</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {window.CC_ACCIONES.map(a => (
            <ActionTile key={a.label} label={a.label} icon={a.icon} />
          ))}
        </div>
      </section>
    </div>
  );
}

// === DASHBOARD DE CRÉDITO ===
function CreditoPage() {
  const [filter, setFilter] = React.useState('todas');
  const [search, setSearch] = React.useState('');
  const cuentas = window.CC_CUENTAS;

  const filtered = cuentas.filter(c => {
    if (filter === 'corriente' && c.diasMora > 0) return false;
    if (filter === 'mora' && c.diasMora === 0) return false;
    if (filter === 'critico' && c.riesgo !== 'rojo') return false;
    if (search && !c.cliente.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totales = {
    saldo: filtered.reduce((s, c) => s + c.saldo, 0),
    cuentas: filtered.length,
    promedioScore: filtered.length ? Math.round(filtered.reduce((s, c) => s + c.score, 0) / filtered.length) : 0,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs financieros */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard
          label="Saldo total"
          value={4287350}
          format="currency"
          icon="Landmark"
          tone="blue"
          delta={-2.4}
          deltaLabel="vs mes pasado"
          deltaPositive="bad"
        />
        <KpiCard
          label="Cuentas activas"
          value={42}
          format="number"
          icon="Users"
          tone="gray"
          hint="Con saldo > $0"
        />
        <KpiCard
          label="Mora >60 días"
          value={486050}
          format="currency"
          icon="AlertTriangle"
          tone="red-strong"
          delta={8.2}
          deltaLabel="vs mes pasado"
          deltaPositive="bad"
        />
        <KpiCard
          label="Score promedio"
          value={71}
          format="number"
          icon="Activity"
          tone="amber"
          delta={-3.1}
          deltaLabel="vs mes pasado"
          deltaPositive="good"
        />
      </div>

      {/* Tabla de cuentas */}
      <Card>
        <CardHeader
          title="Cartera por cliente"
          subtitle={`${filtered.length} cuentas · ${formatMoney(totales.saldo)} en saldo`}
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="Search" size={14} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar cliente…"
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-48"
                  style={{ '--tw-ring-color': 'var(--proesa-navy-500)' }}
                />
              </div>
              <Button size="sm" variant="outline" leftIcon={<Icon name="Download" size={14} />}>Exportar</Button>
            </div>
          }
        />
        <CardBody className="p-0">
          {/* Filtros pill */}
          <div className="flex gap-1 px-5 pt-4">
            {[
              { value: 'todas',     label: `Todas (${cuentas.length})` },
              { value: 'corriente', label: `Al corriente (${cuentas.filter(c => c.diasMora === 0).length})` },
              { value: 'mora',      label: `En mora (${cuentas.filter(c => c.diasMora > 0).length})` },
              { value: 'critico',   label: `Críticos (${cuentas.filter(c => c.riesgo === 'rojo').length})` },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === f.value
                    ? 'bg-[#F2F7FC] text-[#204590]'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider">
                <tr className="border-y border-gray-200">
                  <th className="text-left px-5 py-2.5 font-semibold">Cliente</th>
                  <th className="text-left px-3 py-2.5 font-semibold">
                    <span className="inline-flex items-center">
                      Score
                      <HelpPopover
                        title="Score de riesgo"
                        description="Calificación 0–100 que combina antigüedad de saldo, % de cumplimiento y volumen."
                        formula="0.5·(1 - mora%) + 0.3·cumplimiento + 0.2·log(volumen)"
                        ranges={[
                          { label: '80–100: Al corriente', color: 'bg-green-500' },
                          { label: '60–79: Vigilar',       color: 'bg-yellow-500' },
                          { label: '40–59: Riesgo',        color: 'bg-orange-500' },
                          { label: '0–39: Crítico',        color: 'bg-red-500' },
                        ]}
                      />
                    </span>
                  </th>
                  <th className="text-left px-3 py-2.5 font-semibold">Estado</th>
                  <th className="text-right px-3 py-2.5 font-semibold">Saldo</th>
                  <th className="text-right px-3 py-2.5 font-semibold">Mora</th>
                  <th className="text-left px-3 py-2.5 font-semibold w-48">Antigüedad</th>
                  <th className="text-right px-3 py-2.5 font-semibold">Último pago</th>
                  <th className="text-right px-5 py-2.5 font-semibold w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 align-middle">
                      <div className="font-medium text-gray-900">{c.cliente}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{c.rfc}</div>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums ${
                        c.score >= 80 ? 'text-green-700' :
                        c.score >= 60 ? 'text-yellow-700' :
                        c.score >= 40 ? 'text-orange-700' :
                        'text-red-700'
                      }`}>
                        {c.score}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <RiskBadge category={c.riesgo} score={c.score} />
                    </td>
                    <td className="px-3 py-3 text-right align-middle">
                      <MoneyCell amount={c.saldo} muted={c.saldo === 0} />
                    </td>
                    <td className="px-3 py-3 text-right align-middle tabular-nums text-sm">
                      {c.diasMora === 0
                        ? <span className="text-gray-400">—</span>
                        : <span className={c.diasMora > 60 ? 'text-red-700 font-medium' : c.diasMora > 30 ? 'text-orange-700 font-medium' : 'text-yellow-700'}>{c.diasMora}d</span>}
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <AgingBar
                        buckets={[
                          { key: 'corriente', label: 'Corriente', amount: c.aging.corriente, color: 'bg-green-500' },
                          { key: 'v1_30',     label: '1–30d',     amount: c.aging.v1_30,     color: 'bg-yellow-500' },
                          { key: 'v31_60',    label: '31–60d',    amount: c.aging.v31_60,    color: 'bg-orange-500' },
                          { key: 'v61_90',    label: '61–90d',    amount: c.aging.v61_90,    color: 'bg-red-400' },
                          { key: 'v90_plus',  label: '90+d',      amount: c.aging.v90_plus,  color: 'bg-red-600' },
                        ]}
                        total={c.saldo}
                        compact
                      />
                    </td>
                    <td className="px-3 py-3 text-right align-middle text-sm tabular-nums text-gray-600">
                      {c.ultimoPago ? new Date(c.ultimoPago).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right align-middle">
                      <button className="text-gray-400 hover:text-gray-700 transition-colors">
                        <Icon name="ChevronRight" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Fila total */}
                <tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
                  <td className="px-5 py-3" colSpan={3}>Total</td>
                  <td className="px-3 py-3 text-right">
                    <MoneyCell amount={totales.saldo} />
                  </td>
                  <td className="px-3 py-3"></td>
                  <td className="px-3 py-3"></td>
                  <td className="px-3 py-3"></td>
                  <td className="px-5 py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

Object.assign(window, {
  LoginPage, InicioPage, CreditoPage,
});
