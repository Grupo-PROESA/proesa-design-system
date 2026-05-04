# Auth y SSO · Integración con Portal Gateway

Toda mini-app PROESA delega autenticación al **Portal Gateway** (`proesa-gateway`). El Portal es la única autoridad de identidad; las apps no tienen su propio sistema de usuarios/contraseñas en producción.

> El Portal vive en `portal.grupoproesa.mx:9443` y emite JWT RS256 con JWKS público.

---

## Modelo conceptual

```
┌─────────────────┐                ┌──────────────────────┐
│  Usuario        │ ── login M365 ──▶ Portal Gateway      │
│                 │                │                       │
│                 │ ◀── JWT RS256 ─│  emite JWT por-app    │
│                 │                │  con roles efectivos  │
└─────────────────┘                └──────────────────────┘
        │                                       ▲
        │ accede a                              │ valida JWKS
        ▼                                       │
┌─────────────────────────────┐                 │
│  Mini-app PROESA            │ ────────────────┘
│  (cookie httpOnly cc_session)│
└─────────────────────────────┘
```

---

## Variables de entorno (en cada app)

| Variable | Propósito | Ejemplo |
|---|---|---|
| `VITE_PORTAL_URL` | URL del Portal para `PortalChip` y redirect en SSO | `https://portal.grupoproesa.mx:9443` |
| `VITE_API_BASE` | Backend de la app | `https://api.miapp.grupoproesa.mx` |
| `VITE_DEV_LOCAL_LOGIN` | `'true'` solo en dev local | `true` |
| `VITE_APP_NAME` | Nombre visible de la app | `Control Coberturas` |
| `VITE_APP_VERSION` | Versión visible en el sidebar | `1.4.0` |

En **dev local**, `VITE_DEV_LOCAL_LOGIN=true` activa un login con usuario/contraseña local (sin pasar por el Portal). En **producción**, esta variable se omite y la app redirige al Portal.

---

## Cookie de sesión

- **Nombre**: `cc_session` (Control Coberturas) o `<app>_session` para otras.
- **Tipo**: httpOnly, Secure (https), SameSite=Lax.
- **Domain**: `.grupoproesa.mx` (compartido con Portal en prod).
- **Path**: `/`.
- **Expiración**: 8 horas (configurable por app).

La cookie la emite el backend de la app después de validar el JWT del Portal. El frontend nunca la toca directamente.

---

## Flujo de login (producción)

1. Usuario abre `https://miapp.grupoproesa.mx`.
2. Frontend monta `<App/>`. `AuthProvider` corre `GET /api/auth/me`.
3. Backend ve que no hay cookie → responde `401`.
4. Frontend redirige a `https://portal.grupoproesa.mx:9443/launch?app=miapp&return_to=...`.
5. Portal valida sesión M365. Si OK, emite JWT por-app con roles efectivos y redirige a `https://miapp.grupoproesa.mx/api/auth/sso/callback?token=...`.
6. Backend de la app valida el JWT contra JWKS del Portal, emite cookie `cc_session`, redirige a `return_to`.
7. Frontend monta de nuevo. `GET /api/auth/me` ya devuelve el perfil. `<AuthProvider>` carga `user`, `roles`, `isAuthenticated=true`.

## Flujo de login (dev local)

1. `VITE_DEV_LOCAL_LOGIN=true`.
2. `<LoginPage>` monta el form de email/password.
3. Submit → `POST /api/auth/login` con credenciales locales.
4. Backend valida contra tabla local, emite cookie `cc_session`.
5. Igual que prod desde el paso 7.

---

## Endpoints del backend de la app (contrato canónico)

| Método | Ruta | Cuándo |
|---|---|---|
| `GET` | `/api/auth/me` | Al montar `<AuthProvider>`. 401 si no hay cookie |
| `POST` | `/api/auth/login` | Solo si `VITE_DEV_LOCAL_LOGIN`. Body: `{ email, password }` |
| `POST` | `/api/auth/logout` | Borra cookie. Frontend redirige al Portal |
| `GET` | `/api/auth/sso/callback` | Recibe `?token=...`, valida vs JWKS, emite cookie |
| `POST` | `/api/auth/change-password` | Solo dev local; cuando `mustChangePassword` |

Body de `/api/auth/me`:

```json
{
  "id": "uuid",
  "nombre": "Mariana Hernández",
  "primerNombre": "Mariana",
  "email": "mhernandez@grupoproesa.mx",
  "roles": ["jefe", "nomina"],
  "mustChangePassword": false,
  "metadata": { ... }
}
```

---

## `<AuthProvider>` y `useAuth`

```tsx
import { AuthProvider, useAuth } from "@proesa/design";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

function MyComponent() {
  const { user, isAuthenticated, hasRole, logout } = useAuth();
  if (!hasRole("jefe")) return null;
  // ...
}
```

API expuesta:

| Symbol | Tipo | Notas |
|---|---|---|
| `user` | `User \| null` | `null` mientras carga o sin sesión |
| `isAuthenticated` | `boolean` | `true` si hay user y no `mustChangePassword` |
| `loading` | `boolean` | `true` durante `GET /api/auth/me` |
| `mustChangePassword` | `boolean` | `true` → renderizar form de cambio |
| `login(email, password)` | `Promise<void>` | Solo dev local |
| `logout()` | `Promise<void>` | Llama backend + redirige |
| `hasRole(role)` | `boolean` | True si `user.roles.includes(role)` |
| `hasAnyRole(roles[])` | `boolean` | True si intersecta |

---

## `<ProtectedRoute>`

```tsx
<Route path="/admin" element={
  <ProtectedRoute requireRole="admin">
    <AdminPage />
  </ProtectedRoute>
} />

<Route path="/reportes" element={
  <ProtectedRoute requireAnyRole={["nomina", "admin"]}>
    <ReportesPage />
  </ProtectedRoute>
} />

<Route path="/" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

- Sin prop → solo logueado.
- `requireRole` → exige un rol específico. Si falta, redirige a `/` con toast.
- `requireAnyRole` → exige al menos uno.

---

## CSRF y cookies

- Cookie httpOnly: el frontend nunca la lee, no hay riesgo XSS.
- CSRF: usar header `X-Requested-With: XMLHttpRequest` en POSTs (validado por backend) **o** double-submit pattern (cookie no-httpOnly + header). Decisión por app.
- En `services/api.ts` usar `fetch(url, { credentials: 'include', ... })` siempre.

---

## Dominio compartido

- Producción: subdominio `<app>.grupoproesa.mx` con cookie compartida en `.grupoproesa.mx`.
- Wildcard cert para `*.grupoproesa.mx`.
- Puerto 9443 en el Portal (mientras TI destrabe el 443).

---

## Checklist de integración SSO

- [ ] `VITE_PORTAL_URL` configurada en `.env.production`.
- [ ] Cookie con `Secure`, `HttpOnly`, `SameSite=Lax`, `Domain=.grupoproesa.mx`.
- [ ] `/api/auth/sso/callback` valida JWT contra JWKS del Portal.
- [ ] `/api/auth/me` devuelve el shape canónico (id, nombre, primerNombre, email, roles).
- [ ] CORS configurado para el Portal.
- [ ] `<PortalChip/>` visible en el header (la pista visual de SSO).
- [ ] Coordinar con equipo del gateway: nombre de la app + roles + match_type para registro en `config/apps.yml`.
- [ ] Smoke test: login real desde Portal → cookie en `.grupoproesa.mx` → app carga → logout vuelve al Portal.
