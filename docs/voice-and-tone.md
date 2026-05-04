# Voz y tono · Microcopy PROESA

Toda mini-app del ecosistema habla con la misma voz: **institucional-cálida, calmada, eficiente**. El usuario es un colega del trabajo, no un cliente al que hay que convencer. Las apps son **herramientas**, no productos a vender.

---

## Reglas críticas

1. **Español MX** con acentos correctos. Nunca "Numero", "Pagina", "Codigo", "Direccion", "Telefono", "Busqueda", "Informacion", "Exito", "Atencion".
2. **Segunda persona informal (`tú`)** en UI. Formal (`usted`) solo en correos a paciente externo.
3. **Sin signos de exclamación.** La voz es calmada.
4. **Sin emoji** excepto `👋` en el saludo de Dashboard.
5. **Sin anglicismos** innecesarios. "Iniciar sesión", no "Loguearse". "Contraseña", no "Password".
6. **Sin traducciones literales** del inglés. "No hay coberturas en este filtro", no "You have no coverages".

---

## Patrones por contexto

### Botones

Verbo claro, primera persona del imperativo. **Sin** "OK", "Submit", "Click", "Press".

| ✅ | ❌ |
|---|---|
| Registrar | Agregar nuevo (redundante) |
| Aprobar | Aprobar ahora (la temporalidad sobra) |
| Guardar cambios | Submit / Save |
| Eliminar | Remove |
| Cancelar | Cerrar (cuando es cancelar es cancelar) |
| Volver | Back / Atrás (si Volver cabe) |

### Títulos de página

Sustantivo corto. Sin verbos.

| ✅ | ❌ |
|---|---|
| Inicio | Bienvenido a la app |
| Mis coberturas | Coberturas registradas por mí |
| Pendientes de aprobación | Lista de pendientes |
| Reportes | Centro de reportes |
| Usuarios | Gestión de usuarios |
| Configuración | Ajustes / Preferencias |

### Subtítulos de página

Aclaración chiquita, `text-xs text-gray-400`. Una línea, sin punto final.

| ✅ |
|---|
| Registradas por mí |
| Resumen del día |
| Esperan tu decisión |

### Mensajes de operación

Frases naturales, no códigos. **El sistema reporta lo que pasó, no se disculpa.**

| ✅ | ❌ |
|---|---|
| Cobertura eliminada | Operación exitosa |
| Error al actualizar | Operation failed |
| Las contraseñas nuevas no coinciden | Passwords don't match |
| Sin permiso para esta acción | 403 Forbidden |
| Sesión expirada. Vuelve a iniciar sesión. | Token expired |

### Cargando

Siempre `Cargando…` con elipsis tipográfica `…` (un solo carácter), no tres puntos `...`.

### Estados vacíos

Texto humano. **El usuario no es un sistema de archivos.**

| ✅ | ❌ |
|---|---|
| No hay coberturas en este filtro. | No data |
| Sin pendientes. | 0 results |
| Aún no has registrado movimientos. | Empty state |
| Sin alertas nuevas. | No notifications found |

### Saludos en Dashboard

```
Hola, {primerNombre} 👋
Tienes 3 pendientes hoy.
```

- Solo el `primer` nombre (no nombre completo, no "Sr./Sra.").
- Una línea de bienvenida con dato concreto del día.
- Si no hay pendientes: "No tienes pendientes hoy. Buen trabajo."

### Confirmaciones (ConfirmModal)

```
¿Eliminar cobertura?
Esta acción no se puede deshacer.
[Cancelar] [Eliminar]
```

- Pregunta corta, una línea.
- Consecuencia explícita si la acción es destructiva.
- Botón de confirmación con el verbo específico (`Eliminar`, no `Aceptar`).

### Errores de validación de formulario

Específicos, sin culpar al usuario.

| ✅ | ❌ |
|---|---|
| Ingresa un correo válido. | Invalid email |
| La contraseña debe tener al menos 8 caracteres. | Password too short |
| Selecciona una fecha. | Field required |
| El monto no puede ser negativo. | Invalid value |

---

## Tonos por situación

### Confirmación de éxito (toast success)

Tono neutral. **No celebrar.**

> ✅ "Cobertura registrada"
> ❌ "¡Genial! La cobertura se registró correctamente."

### Error inesperado (toast error)

Específico si se sabe la causa, genérico si no. **No mostrar stack traces.**

> ✅ "Error al guardar. Intenta de nuevo."
> ❌ "TypeError: Cannot read property 'id' of undefined"

### Advertencia (warning)

Avisa, no asusta.

> ✅ "Esta cuenta tiene saldo vencido. Revísala antes de aprobar."
> ❌ "⚠️ ¡Cuidado! Saldo vencido"

### Crítico (alerta crítica en `AlertaCard`)

Directo, factual, accionable.

> ✅ "Saldo vencido +90 días — Lab Clínico XYZ"
> ❌ "ATENCIÓN URGENTE: cliente moroso"

---

## Glosario interno (consistencia)

Si dos apps necesitan el mismo concepto, usen el mismo término.

| Concepto | Término canónico | Evitar |
|---|---|---|
| Sesión del usuario | Iniciar sesión / Cerrar sesión | Login / Logout |
| Cuenta de usuario | Cuenta | Perfil (a menos que sea pantalla de perfil) |
| Recibir un trabajo nuevo | Recibido / Asignado | Inbox / Bandeja |
| Decidir sobre un pendiente | Aprobar / Rechazar | Aceptar / Negar |
| Listado de cosas hechas | Historial | Log |
| Último día con datos | Última actualización | Last sync |
| Identificador único | Folio / Código | ID / Identifier (en UI) |
| Quitar relación | Desvincular | Remove association |

---

## Fechas relativas

Para indicadores en chrome (header, sidebar):

| Diferencia | Texto |
|---|---|
| < 1 min | `ahora` |
| 1-59 min | `hace 5m` |
| 1-23 h | `hace 3h` |
| 1 día exacto | `ayer` |
| 2-6 días | `hace 5d` |
| 7+ días | `12/04` (DD/MM) |

Helper: `formatRelative(iso)` en `@proesa/design/utils`.

Para fechas en tablas: siempre `DD/MM/YYYY` (`formatDateMx`). Para timestamps: `DD/MM/YYYY HH:mm` (`formatDateTimeMx`).

---

## Checklist antes de mergear copy

- [ ] Acentos correctos en TODOS los strings visibles.
- [ ] Sin signos de exclamación.
- [ ] Sin emoji extra (solo `👋` en Dashboard).
- [ ] Botones con verbo claro, no "OK".
- [ ] Mensajes de error son frases, no códigos.
- [ ] Estados vacíos suenan humanos.
- [ ] `Cargando…` usa elipsis tipográfica.
- [ ] Glosario interno respetado (Iniciar sesión, Contraseña, etc.).
