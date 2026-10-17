# Contrato de API - Servicio de Gestión

## 1. Objetivo

Definir el contrato de comunicación del servicio de Gestión de TaskCampus: endpoints, solicitudes, respuestas, autenticación, autorización y errores.

Estado: PROPUESTA. Los endpoints deberán contrastarse con la implementación real antes de considerarse operativos.

## 2. Convenciones generales

- URL base propuesta: /api/gestion/
- Formato de intercambio: JSON.
- Autenticación: token Bearer en la cabecera Authorization.
- Contraseñas: nunca se devuelven en las respuestas.
- Los identificadores se representan como números enteros en los ejemplos.
- Las fechas se representan en formato ISO 8601.
- Los servicios consumidores deben utilizar HTTPS en despliegue.

Cabecera de autenticación:

Authorization: Bearer <token>

## 3. Endpoints propuestos

| Método | Ruta | Función | Acceso |
| --- | --- | --- | --- |
| POST | /api/gestion/registro/ | Registrar usuario | Público |
| POST | /api/gestion/login/ | Iniciar sesión | Público |
| GET | /api/gestion/usuarios/me/ | Consultar perfil | Autenticado |
| PATCH | /api/gestion/usuarios/me/ | Actualizar perfil | Autenticado |
| GET | /api/gestion/usuarios/ | Listar usuarios | ADMIN |
| PATCH | /api/gestion/usuarios/{id}/ | Gestionar usuario | ADMIN |
| POST | /api/gestion/verificar-token/ | Validar token y permisos | Servicio interno autorizado |

Las rutas y nombres definitivos están pendientes de confirmación con el código.

## 4. Registro de usuario

POST /api/gestion/registro/

Solicitud de ejemplo:

```json
{
  "nombre": "Ana",
  "apellido": "Pérez",
  "email": "ana@example.com",
  "password": "ClaveSegura123!"
}
```

Respuesta propuesta: HTTP 201

```json
{
  "id": 12,
  "nombre": "Ana",
  "apellido": "Pérez",
  "email": "ana@example.com",
  "rol": "CLIENTE",
  "estado": "ACTIVO"
}
```

Reglas:
- El registro público siempre asigna CLIENTE.
- El cliente no puede elegir ADMIN en el registro.
- El correo debe ser único.
- La contraseña se valida y almacena de forma segura.
- Nunca se devuelve la contraseña.

## 5. Inicio de sesión

POST /api/gestion/login/

Solicitud:

```json
{
  "email": "ana@example.com",
  "password": "ClaveSegura123!"
}
```

Respuesta propuesta: HTTP 200

```json
{
  "access_token": "<token>",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Nota: expires_in=3600 es un valor propuesto en segundos; la duración real debe acordarse con la implementación.

## 6. Consulta de perfil

GET /api/gestion/usuarios/me/

Cabecera:
Authorization: Bearer <token>

Respuesta propuesta: HTTP 200

```json
{
  "id": 12,
  "nombre": "Ana",
  "apellido": "Pérez",
  "email": "ana@example.com",
  "rol": "CLIENTE",
  "estado": "ACTIVO"
}
```

## 7. Actualización de perfil

PATCH /api/gestion/usuarios/me/

Solicitud de ejemplo:

```json
{
  "nombre": "Ana María"
}
```

Respuesta propuesta: HTTP 200 con el perfil actualizado.

Restricción: los campos rol y estado no deben modificarse desde este endpoint, aunque se incluyan en la solicitud.

## 8. Administración de usuarios

GET /api/gestion/usuarios/

Devuelve una lista de usuarios. Acceso restringido a ADMIN.

PATCH /api/gestion/usuarios/{id}/

Permite operaciones administrativas expresamente autorizadas. Los cambios de rol y estado deben validarse en el servidor.

La protección del último administrador y las reglas específicas de bloqueo se detallarán en sus tareas correspondientes.

## 9. Contrato exacto propuesto: verificar-token

POST /api/gestion/verificar-token/

Objetivo: permitir que otros servicios consulten si un token es válido y qué identidad y permisos tiene el usuario.

Este endpoint debe estar protegido para impedir consultas arbitrarias desde clientes no autorizados.

Autenticación del servicio consumidor: mecanismo interno pendiente de acordar. No debe confundirse con el token del usuario que se está verificando.

Solicitud:

```json
{
  "token": "<token-del-usuario>"
}
```

Respuesta para token válido: HTTP 200

```json
{
  "valido": true,
  "usuario": {
    "id": 12,
    "rol": "CLIENTE",
    "estado": "ACTIVO"
  }
}
```

Respuesta para token inválido o caducado: HTTP 401

```json
{
  "valido": false,
  "usuario": null,
  "error": {
    "codigo": "TOKEN_INVALIDO",
    "mensaje": "Token inválido o caducado"
  }
}
```

Reglas:
- valido siempre es booleano.
- usuario contiene id, rol y estado cuando valido es true.
- usuario es null cuando valido es false.
- No se devuelve la contraseña ni el token recibido.
- Un token caducado o manipulado nunca se considera válido.
- El consumidor debe comprobar el rol y estado antes de permitir operaciones.
- El acceso a verificar-token debe limitarse a servicios autorizados.

IMPORTANTE: este formato es la propuesta exacta para acordar entre equipos. No se ha comprobado aún contra el backend.

## 10. Errores comunes

Formato propuesto:

```json
{
  "error": {
    "codigo": "VALIDACION",
    "mensaje": "Los datos enviados no son válidos",
    "detalles": {}
  }
}
```

| HTTP | Código | Significado |
| --- | --- | --- |
| 400 | VALIDACION | Datos incorrectos |
| 401 | NO_AUTENTICADO | Falta autenticación |
| 401 | TOKEN_INVALIDO | Token inválido o caducado |
| 403 | SIN_PERMISOS | Acceso no autorizado |
| 404 | NO_ENCONTRADO | Recurso inexistente |
| 409 | CONFLICTO | Conflicto con datos existentes |
| 429 | DEMASIADAS_SOLICITUDES | Límite de solicitudes |
| 500 | ERROR_INTERNO | Error inesperado |

## 11. Reglas de seguridad

- No almacenar contraseñas en texto plano.
- No mostrar contraseñas ni tokens en logs.
- Usar HTTPS en entornos desplegados.
- Validar entradas y permisos en el servidor.
- Restringir las operaciones administrativas.
- Aplicar límites de intentos a login y verificación cuando corresponda.
- No confiar en el rol enviado por el frontend.

## 12. Integración con otros servicios

Los servicios consumidores deben:

1. Recibir el token del usuario.
2. Solicitar su validación al servicio de Gestión mediante un canal autorizado.
3. Comprobar valido, rol y estado.
4. Permitir o rechazar la operación.
5. Tratar errores de conexión o validación sin asumir que el usuario está autorizado.

## 13. Pendientes de validación

- Confirmar que TaskCampus contempla realmente este servicio y estas rutas.
- Revisar urls.py, views.py o el backend equivalente.
- Confirmar nombres de campos y roles.
- Confirmar el tipo de token y su caducidad.
- Acordar la autenticación entre servicios.
- Confirmar el formato de verificar-token con los equipos consumidores.
- Probar las respuestas reales antes de marcar el contrato como implementado.
