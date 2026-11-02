# Ejemplos de uso de la API

## Endpoints disponibles

### Health Check
```bash
curl http://localhost:3000/health
```

Respuesta:
```json
{"ok": true}
```

---

## Users

### Listar usuarios
```bash
curl http://localhost:3000/api/users
```

### Obtener usuario por ID
```bash
curl http://localhost:3000/api/users/1
```

### Actualizar usuario
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Nuevo Nombre","email":"nuevo@email.com"}'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

---

## Validación con Zod

La API valida automáticamente los datos de entrada usando Zod.

### Ejemplo de validación fallida

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","name":"A"}'
```

**Response (400):**
```json
{
  "errors": {
    "formErrors": [],
    "fieldErrors": {
      "name": ["El nombre debe tener al menos 2 caracteres"],
      "email": ["Email inválido"]
    }
  }
}
```

### Ejemplo de validación exitosa

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez"}'
```

**Response (200):**
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "createdAt": "2024-11-04T11:30:00.000Z"
}
```

---

## Manejo de errores

### Usuario no encontrado (404)
```bash
curl http://localhost:3000/api/users/999
```

**Response:**
```json
{
  "message": "Usuario no encontrado"
}
```

### Email duplicado (409)
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"email@existente.com"}'
```

**Response:**
```json
{
  "message": "El email ya está en uso"
}
```

---

## Próximamente

En versiones futuras se añadirán:
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login con JWT
- `GET /api/users/me` - Perfil del usuario autenticado
- Rutas protegidas con JWT

