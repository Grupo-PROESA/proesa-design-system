// Datos mock de ControlConsumos para el mockup PROESA-fied
window.CC_USER = {
  nombre: 'Rodrigo Tapia',
  primerNombre: 'Rodrigo',
  email: 'rtapia@grupoproesa.mx',
  roles: ['Coordinador de cartera', 'Admin'],
};

window.CC_LAST_SYNC = '2026-05-01T08:42:00-06:00';

window.CC_KPIS_INICIO = [
  {
    label: 'Saldo cartera',
    value: 4287350,
    format: 'currency',
    icon: 'Landmark',
    tone: 'blue',
    delta: -2.4,
    deltaLabel: 'vs mes pasado',
    deltaPositive: 'bad', // bajar saldo es bueno
    to: '/credito',
  },
  {
    label: '% mora >30d',
    value: 14.2,
    format: 'percent',
    icon: 'TrendingDown',
    tone: 'amber',
    delta: 1.8,
    deltaLabel: 'vs mes pasado',
    deltaPositive: 'bad', // subir mora es malo
    to: '/credito?filter=vencido',
  },
  {
    label: 'Cuentas en revisión',
    value: 7,
    format: 'number',
    icon: 'AlertCircle',
    tone: 'amber-strong',
    hint: 'Esperan tu decisión',
    to: '/credito?filter=revision',
  },
];

window.CC_ACCIONES = [
  { label: 'Registrar pago', icon: 'CircleDollarSign', to: '/pago' },
  { label: 'Nueva nota', icon: 'FilePlus', to: '/nota' },
  { label: 'Ver alertas', icon: 'Bell', to: '/alertas' },
  { label: 'Compromisos hoy', icon: 'CalendarCheck', to: '/compromisos' },
];

window.CC_SISTEMA = [
  { label: 'Última sincronización', value: 'Hoy 08:42', tone: 'green', icon: 'CheckCircle2' },
  { label: 'Registros pendientes', value: '0', tone: 'green', icon: 'CheckCircle2' },
  { label: 'Errores 24h', value: '0', tone: 'green', icon: 'CheckCircle2' },
];

// Aging del portafolio
window.CC_AGING = {
  total: 4287350,
  buckets: [
    { key: 'corriente', label: 'Corriente', amount: 3215000, color: 'bg-green-500' },
    { key: 'v1_30', label: '1–30d', amount: 542000, color: 'bg-yellow-500' },
    { key: 'v31_60', label: '31–60d', amount: 312000, color: 'bg-orange-500' },
    { key: 'v61_90', label: '61–90d', amount: 138000, color: 'bg-red-400' },
    { key: 'v90_plus', label: '90+d', amount: 80350, color: 'bg-red-600' },
  ],
};

// Cuentas de la cartera (Dashboard de Crédito)
window.CC_CUENTAS = [
  {
    id: 1,
    cliente: 'Hospital Ángeles del Pedregal',
    rfc: 'HAP920514XYZ',
    saldo: 1248500,
    diasMora: 0,
    score: 92,
    riesgo: 'verde',
    aging: { corriente: 1248500, v1_30: 0, v31_60: 0, v61_90: 0, v90_plus: 0 },
    ultimoPago: '2026-04-28',
  },
  {
    id: 2,
    cliente: 'Clínica San Ángel Inn',
    rfc: 'CSAI870322ABC',
    saldo: 487200,
    diasMora: 18,
    score: 71,
    riesgo: 'amarillo',
    aging: { corriente: 320000, v1_30: 167200, v31_60: 0, v61_90: 0, v90_plus: 0 },
    ultimoPago: '2026-04-12',
  },
  {
    id: 3,
    cliente: 'Lab Clínico Polanco',
    rfc: 'LCP010715QWE',
    saldo: 312800,
    diasMora: 42,
    score: 54,
    riesgo: 'naranja',
    aging: { corriente: 80000, v1_30: 60000, v31_60: 172800, v61_90: 0, v90_plus: 0 },
    ultimoPago: '2026-03-15',
  },
  {
    id: 4,
    cliente: 'Sanatorio Durango',
    rfc: 'SDU981102MNB',
    saldo: 198450,
    diasMora: 67,
    score: 38,
    riesgo: 'rojo',
    aging: { corriente: 0, v1_30: 0, v31_60: 32000, v61_90: 138000, v90_plus: 28450 },
    ultimoPago: '2026-02-22',
  },
  {
    id: 5,
    cliente: 'Centro Médico Reforma',
    rfc: 'CMR950728RTY',
    saldo: 654200,
    diasMora: 8,
    score: 84,
    riesgo: 'verde',
    aging: { corriente: 580000, v1_30: 74200, v31_60: 0, v61_90: 0, v90_plus: 0 },
    ultimoPago: '2026-04-25',
  },
  {
    id: 6,
    cliente: 'IMQ Servicios Médicos',
    rfc: 'IMQ020410GHJ',
    saldo: 421300,
    diasMora: 0,
    score: 88,
    riesgo: 'verde',
    aging: { corriente: 421300, v1_30: 0, v31_60: 0, v61_90: 0, v90_plus: 0 },
    ultimoPago: '2026-04-30',
  },
  {
    id: 7,
    cliente: 'Clínica Lomas Verdes',
    rfc: 'CLV890914ZXC',
    saldo: 287600,
    diasMora: 95,
    score: 24,
    riesgo: 'rojo',
    aging: { corriente: 0, v1_30: 0, v31_60: 0, v61_90: 0, v90_plus: 287600 },
    ultimoPago: '2026-01-08',
  },
  {
    id: 8,
    cliente: 'Hospital Español',
    rfc: 'HES850620UIO',
    saldo: 0,
    diasMora: 0,
    score: 95,
    riesgo: 'verde',
    aging: { corriente: 0, v1_30: 0, v31_60: 0, v61_90: 0, v90_plus: 0 },
    ultimoPago: '2026-04-29',
  },
  {
    id: 9,
    cliente: 'Médica Sur',
    rfc: 'MSU790805PLM',
    saldo: 892100,
    diasMora: 22,
    score: 68,
    riesgo: 'amarillo',
    aging: { corriente: 620000, v1_30: 272100, v31_60: 0, v61_90: 0, v90_plus: 0 },
    ultimoPago: '2026-04-09',
  },
];

// Alertas del drawer
window.CC_ALERTAS = [
  {
    id: 1,
    severidad: 'critical',
    titulo: 'Saldo vencido +90 días',
    mensaje: '$287,600 sin movimiento desde enero. Considera escalar a jurídico.',
    cliente: 'Clínica Lomas Verdes',
    created_at: '2026-05-01T07:15:00',
    leida: false,
  },
  {
    id: 2,
    severidad: 'critical',
    titulo: 'Promesa de pago vencida',
    mensaje: 'Compromiso del 28/04 sin cumplir.',
    cliente: 'Sanatorio Durango',
    created_at: '2026-04-30T16:42:00',
    leida: false,
  },
  {
    id: 3,
    severidad: 'warning',
    titulo: 'Score bajó 12 puntos',
    mensaje: 'De 66 a 54 en los últimos 30 días.',
    cliente: 'Lab Clínico Polanco',
    created_at: '2026-04-29T09:20:00',
    leida: false,
  },
  {
    id: 4,
    severidad: 'warning',
    titulo: 'Saldo cruzó umbral 30d',
    mensaje: 'Primera factura entró en mora corta.',
    cliente: 'Médica Sur',
    created_at: '2026-04-28T11:05:00',
    leida: false,
  },
  {
    id: 5,
    severidad: 'info',
    titulo: 'Nuevo contacto registrado',
    mensaje: 'Tesorería actualizó datos del cliente.',
    cliente: 'Centro Médico Reforma',
    created_at: '2026-04-27T14:30:00',
    leida: true,
  },
  {
    id: 6,
    severidad: 'success',
    titulo: 'Pago aplicado',
    mensaje: '$487,200 acreditados.',
    cliente: 'Clínica San Ángel Inn',
    created_at: '2026-04-26T10:18:00',
    leida: true,
  },
];

window.CC_NAV = [
  { section: null, items: [
    { id: 'inicio', label: 'Inicio', icon: 'LayoutDashboard', to: '/' },
  ]},
  { section: 'OPERACIÓN', items: [
    { id: 'credito', label: 'Crédito', icon: 'Landmark', to: '/credito' },
    { id: 'prepago', label: 'Prepago', icon: 'Wallet', to: '/prepago' },
    { id: 'privados', label: 'Privados', icon: 'Users', to: '/privados' },
    { id: 'sd', label: 'SD', icon: 'Building2', to: '/sd' },
  ]},
  { section: 'ADMINISTRACIÓN', items: [
    { id: 'reporte-iva', label: 'Reporte IVA', icon: 'FileSpreadsheet', to: '/reporte-iva' },
    { id: 'reporte-ejec', label: 'Reporte Ejecutivo', icon: 'BarChart3', to: '/reporte-ejecutivo' },
  ]},
  { section: 'SOPORTE', items: [
    { id: 'sync', label: 'Sincronización', icon: 'RefreshCw', to: '/sync' },
    { id: 'ayuda', label: 'Ayuda', icon: 'HelpCircle', to: '/ayuda' },
  ]},
];
