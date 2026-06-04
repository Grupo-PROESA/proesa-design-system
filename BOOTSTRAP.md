# BOOTSTRAP — Crear app PROESA nueva desde cero

Este documento es para **Claude Code** (o cualquier agente) que recibe la tarea "arranca una app nueva del ecosistema PROESA". Sigue los pasos en orden, sin saltar ninguno.

> **Stack canónico:** Vite + React 18 + TypeScript strict + Tailwind v4 + lucide-react + react-router-dom v6+. Si tu app **debe** salirse de este stack por razones técnicas, lee primero §"Salirse del stack canónico" al final.

---

## 0. Antes de empezar

Confirma con el usuario:

1. **Nombre de la app** (sin espacios, kebab-case): `mi-app`.
2. **Nombre visible** (con espacios, mayúsculas): `Mi App`.
3. **Tipo de dominio** (para elegir icono brand): cobertura, compras, cartera, lab, BI, RH, inventario, otro.
4. **Roles esperados** (al menos uno funcional): `jefe`, `comprador`, `coordinador`, etc.
5. **Puerto interno** que ocupará en el servidor LANS (revisar tabla de `docs/deploy.md`).
6. **¿La app vivirá detrás del Portal Gateway o standalone?** (default: detrás del Portal).

Si falta alguno, pídelo al usuario antes de generar archivos.

---

## 1. Estructura inicial

Crear el repo con esta estructura:

```
mi-app/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── pages/
│       │   ├── Login.tsx          # importa LoginPage de @proesa/design
│       │   └── Dashboard.tsx      # usa DashboardTemplate de @proesa/design
│       ├── services/
│       │   └── api.ts
│       └── utils/
├── backend/                       # según la app (Node, Python, etc.)
├── docs/
│   └── DEPLOY.md
├── .github/
│   └── workflows/
│       └── deploy.yml
├── CLAUDE.md
└── README.md
```

---

## 2. Frontend — `package.json`

```json
{
  "name": "mi-app-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --noEmit"
  },
  "dependencies": {
    "@proesa/design": "github:Grupo-PROESA/proesa-design-system",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2",
    "vite": "^6.0.5"
  }
}
```

**Notas:**
- `@proesa/design` se instala vía git URL. Es un repo público en `Grupo-PROESA/`.
- Para pinear a un tag: `"@proesa/design": "github:Grupo-PROESA/proesa-design-system#v0.1.0"`.

---

## 3. `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE || "http://localhost:4600",
        changeOrigin: true,
      },
    },
  },
});
```

---

## 4. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 5. `index.html`

```html
<!DOCTYPE html>
<html lang="es-MX">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi App · PROESA</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 6. `src/index.css`

```css
@import "tailwindcss";
@import "@proesa/design/tokens";
@import "@proesa/design/preset";
```

**Tres líneas. No añadir reset propio, no redefinir variables, no overridear el preset.** Si necesitas estilos custom, ponlos al final con `@layer utilities` o como CSS modules en componentes.

---

## 7. `src/main.tsx`

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

---

## 8. `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, ProtectedRoute, LoginPage } from "@proesa/design";
import { DashboardPage } from "./pages/Dashboard";

function AppRoutes() {
  const { isAuthenticated, mustChangePassword, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando…</p>
      </div>
    );
  }

  if (isAuthenticated && mustChangePassword) {
    return <LoginPage appName="Mi App" mode="changePassword" />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage appName="Mi App" />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## 9. `src/pages/Dashboard.tsx`

```tsx
import { Layout, DashboardTemplate, KpiCard } from "@proesa/design";
import { ListChecks, Clock, AlertTriangle } from "lucide-react";
import { useAuth } from "@proesa/design";
import { navSections } from "../navConfig";

export function DashboardPage() {
  const { user, hasRole } = useAuth();
  return (
    <Layout
      appName="Mi App"
      brandIcon="Shield"
      navSections={navSections}
      title="Inicio"
      subtitle="Resumen del día"
    >
      <DashboardTemplate
        primerNombre={user?.primerNombre ?? "—"}
        roles={user?.roles ?? []}
        kpis={
          hasRole("jefe")
            ? [
                <KpiCard key="1" label="Pendientes" value={3} tone="amber-strong" icon={<ListChecks size={18} />} hint="Esperan tu decisión" />,
                <KpiCard key="2" label="Hoy" value={12} tone="blue" icon={<Clock size={18} />} />,
                <KpiCard key="3" label="Atrasados" value={1} tone="red" icon={<AlertTriangle size={18} />} />,
              ]
            : []
        }
      />
    </Layout>
  );
}
```

---

## 10. `src/navConfig.ts`

```ts
import { LayoutDashboard, ListChecks, FileSpreadsheet, Settings, HelpCircle } from "lucide-react";
import type { NavSection } from "@proesa/design";

export const navSections: NavSection[] = [
  {
    title: null,
    items: [{ to: "/", label: "Inicio", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Operación",
    items: [{ to: "/pendientes", label: "Pendientes", icon: ListChecks, roles: ["jefe"] }],
  },
  {
    title: "Administración",
    items: [
      { to: "/reportes", label: "Reportes", icon: FileSpreadsheet, roles: ["nomina", "admin"] },
      { to: "/configuracion", label: "Configuración", icon: Settings, roles: ["admin"] },
    ],
  },
  {
    title: "Soporte",
    items: [{ to: "/ayuda", label: "Ayuda", icon: HelpCircle }],
  },
];
```

---

## 11. `src/services/api.ts`

```ts
import { apiClient } from "@proesa/design/utils";

const api = apiClient(import.meta.env.VITE_API_BASE ?? "");

export const auth = {
  me: () => api.get<{ id: string; nombre: string; primerNombre: string; email: string; roles: string[]; mustChangePassword: boolean }>("/api/auth/me"),
  login: (email: string, password: string) => api.post("/api/auth/login", { email, password }),
  logout: () => api.post("/api/auth/logout"),
};

// Agrega aquí más namespaces por dominio según la app crece.
```

---

## 12. `.env.example`

```
VITE_PORTAL_URL=https://portal.grupoproesa.mx:9443
VITE_API_BASE=http://localhost:4600
VITE_DEV_LOCAL_LOGIN=true
VITE_APP_NAME=Mi App
VITE_APP_VERSION=0.1.0
```

`.env.production` (no commitear el real, sí el `.example`):

```
VITE_PORTAL_URL=https://portal.grupoproesa.mx:9443
VITE_API_BASE=https://api.miapp.grupoproesa.mx
VITE_APP_NAME=Mi App
VITE_APP_VERSION=0.1.0
# VITE_DEV_LOCAL_LOGIN=  ← se omite en prod
```

---

## 13. `CLAUDE.md` para la app

Crear con este contenido base:

```md
# Mi App · Notas para Claude Code

## Stack
- Vite + React 18 + TS strict
- Tailwind v4
- @proesa/design (sistema de diseño del ecosistema)

## Roles
- `admin` — gestión de usuarios y configuración
- `jefe` — aprobaciones del flujo principal
- `nomina` — reportes

## Endpoints clave
- `GET /api/auth/me` — perfil del usuario logueado
- (resto se documenta conforme crece)

## Antes de mergear
- `npm run typecheck` limpio
- Sigue las reglas de `@proesa/design/docs/ui-pattern.md`
- Acentos correctos en TODO el copy en español
```

---

## 14. Backend (esqueleto)

Si la app es Node.js/Express:

```js
// backend/src/index.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: process.env.PORTAL_URL ?? "http://localhost:5173",
  credentials: true,
}));

app.get("/api/auth/me", (req, res) => {
  // Validar cookie; si OK, devolver perfil; si no, 401
  res.status(401).json({ error: "No autenticado" });
});

const PORT = process.env.PORT ?? 4600;
app.listen(PORT, () => console.log(`Backend en :${PORT}`));
```

Si es Python/FastAPI: ver `docs/auth-and-sso.md` para el contrato de endpoints.

---

## 15. Workflow de deploy

`.github/workflows/deploy.yml` para servidor LANS — ver `docs/deploy.md` §"GitHub Actions self-hosted runner".

---

## 16. Smoke test final

Después del primer deploy:

1. `https://miapp.grupoproesa.mx` carga.
2. Sin sesión, redirige al Portal.
3. Portal autentica vía M365.
4. Vuelve a la app con sesión.
5. `<PortalChip/>` visible en header.
6. Click en `<PortalChip/>` lleva al Portal.
7. Sidebar tiene navy-900 y secciones filtradas por rol.
8. Brand mark con gradient navy→teal.
9. KPIs en Inicio muestran datos del rol activo.

Si algo falla: ver `docs/ui-pattern.md` §"Checklist de se ve PROESA".

---

## Salirse del stack canónico

Si **debes** usar otro framework (ej. Refine + Antd como SED-PROESA, o JSX puro sin TS):

1. NO instalar `@proesa/design` completo. Solo importar tokens.
2. Lee `MIGRATION.md` — está pensado para apps que adoptan look&feel sin cambiar stack.
3. Replicar a mano los componentes de chrome (Sidebar, Header, PortalChip) usando los tokens.
4. Documentar la decisión en el `CLAUDE.md` de la app: por qué se salió, qué piezas adoptó.

**No mezclar:** una app que importa `<Sidebar/>` de `@proesa/design` no puede también usar Antd Layout. Pick one.
