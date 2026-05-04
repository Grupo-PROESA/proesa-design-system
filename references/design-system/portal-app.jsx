// PortalApp — main React component for the PROESA app launcher portal

const { useState, useMemo, useEffect } = React;

// ---- helpers ----
const Icon = ({ name, ...rest }) => (
  <i data-lucide={name} {...rest} />
);

const formatDate = (d) => {
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const days = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`;
};

const greeting = (h) => {
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

// ---- Top nav ----
const TopNav = () => (
  <nav className="portal-nav">
    <img className="portal-nav__logo" src="assets/logo-proesa.png" alt="PROESA" />
    <span className="portal-nav__divider" />
    <span className="portal-nav__product">Portal de Aplicaciones</span>
    <span className="portal-nav__spacer" />
    <button className="portal-nav__action" title="Notificaciones">
      <Icon name="bell" style={{ width: 18, height: 18 }} />
    </button>
    <button className="portal-nav__action" title="Ayuda">
      <Icon name="circle-help" style={{ width: 18, height: 18 }} />
    </button>
    <button className="portal-nav__action">
      <Icon name="settings" style={{ width: 16, height: 16 }} />
      Administrar
    </button>
    <span className="portal-nav__divider" />
    <div className="portal-nav__avatar">{window.CURRENT_USER.initials}</div>
    <button className="portal-nav__action">
      Cerrar sesión
    </button>
  </nav>
);

// ---- Hero ----
const Hero = ({ totalApps }) => {
  const now = new Date();
  return (
    <section className="hero">
      <div className="hero__mark" />
      <div className="hero__mark2" />
      <div className="hero__inner">
        <div className="hero__row">
          <div>
            <div className="hero__date">{formatDate(now)}</div>
            <h1 className="hero__greeting">
              {greeting(now.getHours())},<br />
              <strong>{window.CURRENT_USER.firstName}.</strong>
            </h1>
            <div className="hero__role">{window.CURRENT_USER.role} · Grupo PROESA</div>
          </div>
          <div className="hero__stats">
            <div>
              <div className="hero__stat-num">{totalApps}</div>
              <div className="hero__stat-label">Módulos disponibles</div>
            </div>
            <div>
              <div className="hero__stat-num">5</div>
              <div className="hero__stat-label">Categorías de trabajo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---- Resume (Continuar donde lo dejaste) ----
const ResumeCard = ({ app }) => {
  const cat = window.CATEGORY_META[app.category];
  return (
    <a className="resume__item" href="#" style={{ '--cat-dot': cat.dot }}>
      <div className="resume__icon"><Icon name={app.icon} /></div>
      <div className="resume__body">
        <h3 className="resume__name">{app.name}</h3>
        <div className="resume__meta">
          <span className="resume__cat">{app.category}</span>
          <span> · Último uso {window.timeAgo(app.lastUsed)}</span>
        </div>
      </div>
      <span className="resume__arrow"><Icon name="arrow-right" style={{ width: 20, height: 20 }} /></span>
    </a>
  );
};

const Resume = ({ apps }) => {
  const recent = [...apps].sort((a, b) => a.lastUsed - b.lastUsed).slice(0, 2);
  return (
    <div className="resume">
      <div className="resume__head">
        <span className="resume__eyebrow">Continuar donde lo dejaste</span>
      </div>
      <div className="resume__row">
        {recent.map(app => <ResumeCard key={app.id} app={app} />)}
      </div>
    </div>
  );
};

// ---- Grid card ----
const AppCard = ({ app, pinned, onPin }) => {
  const cat = window.CATEGORY_META[app.category];
  return (
    <a className="app-card" href="#" style={{ '--cat-dot': cat.dot, '--cat-tint': cat.tint }}>
      <div className="app-card__top">
        <div className="app-card__icon"><Icon name={app.icon} /></div>
        <button
          className={`app-card__pin ${pinned ? 'app-card__pin--active' : ''}`}
          onClick={(e) => { e.preventDefault(); onPin(app.id); }}
          title={pinned ? 'Quitar de favoritos' : 'Marcar como favorito'}
        >
          <Icon name={pinned ? 'star' : 'star'} fill={pinned ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div>
        <h3 className="app-card__name">{app.name}</h3>
        <p className="app-card__desc">{app.desc}</p>
      </div>
      <div className="app-card__foot">
        <span>Último uso · {window.timeAgo(app.lastUsed)}</span>
        <span className="app-card__open">Abrir <Icon name="arrow-right" /></span>
      </div>
    </a>
  );
};

// ---- List row ----
const AppRow = ({ app }) => {
  const cat = window.CATEGORY_META[app.category];
  return (
    <a className="list__row" href="#" style={{ '--cat-dot': cat.dot, '--cat-tint': cat.tint }}>
      <div className="list__icon"><Icon name={app.icon} /></div>
      <div className="list__body">
        <p className="list__name">{app.name}</p>
        <p className="list__desc">{app.desc}</p>
      </div>
      <div className="list__cat">{app.category}</div>
      <div className="list__used">{window.timeAgo(app.lastUsed)}</div>
      <span className="list__chev"><Icon name="chevron-right" /></span>
    </a>
  );
};

// ---- Category section ----
const CategorySection = ({ name, apps, view, pinned, onPin }) => {
  const cat = window.CATEGORY_META[name];
  return (
    <section className="cat" style={{ '--cat-dot': cat.dot }}>
      <div className="cat__head">
        <span className="cat__dot" />
        <span className="cat__name">{name}</span>
        <span className="cat__rule" />
        <span className="cat__count">{apps.length} {apps.length === 1 ? 'módulo' : 'módulos'}</span>
      </div>
      {view === 'grid' ? (
        <div className="grid">
          {apps.map(a => <AppCard key={a.id} app={a} pinned={pinned.has(a.id)} onPin={onPin} />)}
        </div>
      ) : (
        <div className="list">
          {apps.map(a => <AppRow key={a.id} app={a} />)}
        </div>
      )}
    </section>
  );
};

// ---- Main app ----
const PortalApp = () => {
  const [view, setView] = useState('grid');
  const [pinned, setPinned] = useState(new Set());

  const apps = window.PORTAL_APPS;

  // Group by category, preserving display order
  const categoryOrder = ['Operaciones', 'Recursos Humanos', 'Finanzas', 'Calidad', 'Administración'];
  const grouped = useMemo(() => {
    const map = {};
    for (const a of apps) {
      (map[a.category] = map[a.category] || []).push(a);
    }
    // sort each category by useCount desc
    Object.values(map).forEach(arr => arr.sort((a, b) => b.useCount - a.useCount));
    return categoryOrder.filter(c => map[c]).map(c => [c, map[c]]);
  }, [apps]);

  const togglePin = (id) => {
    setPinned(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Re-init Lucide icons whenever the DOM updates
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  return (
    <div data-screen-label="01 Portal Home">
      <TopNav />
      <Hero totalApps={apps.length} />
      <main className="main">
        <Resume apps={apps} />

        <div className="section-head">
          <h2 className="section-head__title">
            Tus módulos
            <span className="section-head__count">{apps.length}</span>
          </h2>
          <div className="view-toggle" role="tablist" aria-label="Modo de vista">
            <button
              className={`view-toggle__btn ${view === 'grid' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => setView('grid')}
            >
              <Icon name="layout-grid" /> Tarjetas
            </button>
            <button
              className={`view-toggle__btn ${view === 'list' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => setView('list')}
            >
              <Icon name="list" /> Lista
            </button>
          </div>
        </div>

        {grouped.map(([name, list]) => (
          <CategorySection
            key={name}
            name={name}
            apps={list}
            view={view}
            pinned={pinned}
            onPin={togglePin}
          />
        ))}
      </main>

      <footer className="foot">
        <div>© Grupo PROESA · Portal de Aplicaciones</div>
        <div>v2.4 · portal.grupoproesa.mx</div>
      </footer>
    </div>
  );
};

window.PortalApp = PortalApp;
