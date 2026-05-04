// Datos de apps del portal PROESA
// Cada app tiene: id, nombre, descripción, icono Lucide, categoría, último uso (timestamp ms ago)

window.PORTAL_APPS = [
  // Operaciones
  { id: 'planeacion-compras', name: 'Planeación de Compras', desc: 'Órdenes de compra, pronósticos y proyecciones de insumos.', icon: 'shopping-cart', category: 'Operaciones', lastUsed: 6 * 3600 * 1000, useCount: 142 },
  { id: 'control-inventario', name: 'Control de Inventario', desc: 'Trazabilidad de reactivos, lotes y caducidades.', icon: 'boxes', category: 'Operaciones', lastUsed: 26 * 3600 * 1000, useCount: 88 },
  { id: 'logistica-rutas', name: 'Logística y Rutas', desc: 'Asignación de rutas de recolección y entrega de muestras.', icon: 'truck', category: 'Operaciones', lastUsed: 3 * 24 * 3600 * 1000, useCount: 34 },
  { id: 'mantenimiento', name: 'Mantenimiento de Equipos', desc: 'Calendario y bitácoras de equipo de laboratorio.', icon: 'wrench', category: 'Operaciones', lastUsed: 8 * 24 * 3600 * 1000, useCount: 12 },

  // Recursos Humanos
  { id: 'evaluacion-desempeno', name: 'Evaluación de Desempeño', desc: 'Objetivos, KPIs y revisiones del ciclo anual.', icon: 'target', category: 'Recursos Humanos', lastUsed: 2 * 3600 * 1000, useCount: 56 },
  { id: 'organigrama', name: 'Organigrama Activo', desc: 'Estructura jerárquica y puestos vigentes.', icon: 'network', category: 'Recursos Humanos', lastUsed: 4 * 24 * 3600 * 1000, useCount: 19 },
  { id: 'capacitacion', name: 'Capacitación', desc: 'Cursos, certificaciones y rutas de aprendizaje.', icon: 'graduation-cap', category: 'Recursos Humanos', lastUsed: 11 * 24 * 3600 * 1000, useCount: 8 },

  // Finanzas
  { id: 'control-coberturas', name: 'Control de Coberturas', desc: 'Autorización y cálculo de pagos extraordinarios con flujo jerárquico.', icon: 'shield-check', category: 'Finanzas', lastUsed: 6 * 3600 * 1000, useCount: 97 },
  { id: 'presupuestos', name: 'Presupuestos', desc: 'Planeación, ejecución y desviaciones por unidad de negocio.', icon: 'line-chart', category: 'Finanzas', lastUsed: 32 * 3600 * 1000, useCount: 64 },
  { id: 'facturacion', name: 'Facturación Corporativa', desc: 'Emisión y conciliación de CFDI multi-RFC.', icon: 'file-text', category: 'Finanzas', lastUsed: 5 * 24 * 3600 * 1000, useCount: 41 },

  // Calidad y Cumplimiento
  { id: 'no-conformidades', name: 'No Conformidades', desc: 'Registro y seguimiento de hallazgos de calidad.', icon: 'alert-triangle', category: 'Calidad', lastUsed: 18 * 3600 * 1000, useCount: 27 },
  { id: 'auditoria-interna', name: 'Auditoría Interna', desc: 'Programación y evidencias de auditorías ISO.', icon: 'clipboard-check', category: 'Calidad', lastUsed: 14 * 24 * 3600 * 1000, useCount: 6 },

  // Administración
  { id: 'gateway-admin', name: 'Gateway Admin', desc: 'Administración del portal: apps, reglas e identidades.', icon: 'settings-2', category: 'Administración', lastUsed: 24 * 3600 * 1000, useCount: 23 },
  { id: 'directorio', name: 'Directorio Corporativo', desc: 'Búsqueda de personas, áreas y centros de trabajo.', icon: 'contact', category: 'Administración', lastUsed: 50 * 3600 * 1000, useCount: 31 },
];

// Categoría → color de acento (sutil; sólo se usa como punto/línea, no como bloque)
window.CATEGORY_META = {
  'Operaciones':       { dot: '#204590', tint: '#E3EEF8' },  // navy
  'Recursos Humanos':  { dot: '#37A992', tint: '#E2F2EC' },  // teal
  'Finanzas':          { dot: '#1D5E70', tint: '#D8E8EC' },  // teal-900
  'Calidad':           { dot: '#E8A33A', tint: '#FBF1DE' },  // warning warm
  'Administración':    { dot: '#4B5468', tint: '#E7EAF1' },  // gray
};

window.CURRENT_USER = {
  name: 'Rodrigo Tovar',
  firstName: 'Rodrigo',
  initials: 'RT',
  role: 'Dirección de Operaciones',
};

// Helper: formato de "hace X"
window.timeAgo = (ms) => {
  const h = ms / 3600 / 1000;
  if (h < 1) return `hace ${Math.round(ms / 60 / 1000)} min`;
  if (h < 24) return `hace ${Math.round(h)} h`;
  const d = Math.round(h / 24);
  return `hace ${d} día${d === 1 ? '' : 's'}`;
};
