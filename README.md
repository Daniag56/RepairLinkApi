# API Express + PostgreSQL - Proyecto Incremental

Este proyecto implementa una API REST con Node.js, Express y PostgreSQL siguiendo un desarrollo incremental versionado con Git tags.

## 📋 Navegación entre versiones

### Ver todas las versiones disponibles
```bash
git tag
```

### Cambiar a una versión específica
```bash
git checkout v0.1.0
```

### Volver a la última versión
```bash
git checkout main
```

### Ver diferencias entre versiones
```bash
git diff v0.1.0 v0.2.0
```

## 🗂️ Versiones del proyecto

### v0.1.0 - Proyecto base
**Qué incluye:**
- Inicialización del proyecto npm
- Configuración de TypeScript
- Dependencias base instaladas
- Estructura de carpetas
- Scripts de desarrollo
- Configuración de variables de entorno

**Comandos para reproducir:**
```bash
npm init -y
npm install express cors helmet morgan dotenv bcrypt jsonwebtoken zod
npm install -D nodemon typescript @types/node @types/express @types/jsonwebtoken @types/bcrypt @types/cors @types/morgan ts-node
npx tsc --init
```

**Estructura creada:**
```
src/
  config/
  middleware/
  modules/
    auth/
    users/
  utils/
  tests/
```

---

### v0.2.0 - Express básico
**Qué incluye:**
- Servidor Express configurado
- Configuración de variables de entorno
- Middleware básicos (helmet, cors, morgan)
- Endpoint /health
- Manejo básico de errores

**Archivos principales:**
- `src/index.ts` - Arranque del servidor
- `src/app.ts` - Configuración de Express
- `src/config/env.ts` - Variables de entorno
- `src/middleware/error.ts` - Manejador de errores

**Probar:**
```bash
npm run dev
curl http://localhost:3000/health
```

---

### v0.3.0 - PostgreSQL + Docker
**Qué incluye:**
- Docker Compose con PostgreSQL
- Conexión a base de datos
- Tabla users creada
- Cliente de base de datos (pg o Prisma)

**Comandos:**
```bash
docker-compose up -d
npm run migrate
```

**Archivos principales:**
- `docker-compose.yml`
- `src/config/db.ts`
- Migraciones SQL o Prisma

---

### v0.4.0 - Validación con Zod
**Qué incluye:**
- Esquemas de validación con Zod
- Middleware de validación
- Esquemas para auth y users

**Archivos principales:**
- `src/middleware/validate.ts`
- `src/modules/users/users.schema.ts`

---

### v0.5.0 - Módulo Auth (registro/login)
**Qué incluye:**
- Registro de usuarios con hash de contraseñas
- Login con generación de JWT
- Auth service, controller y routes

**Endpoints disponibles:**
- `POST /api/auth/register`
- `POST /api/auth/login`

**Probar:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","password":"12345678"}'
```

---

### v0.6.0 - Middleware de autenticación
**Qué incluye:**
- Middleware JWT para proteger rutas
- Verificación de tokens
- Usuario en request

**Archivos principales:**
- `src/middleware/auth.ts`

---

### v0.7.0 - Módulo Users completo
**Qué incluye:**
- Users service completo
- Listado de usuarios (protegido)
- Endpoint /me para obtener perfil

**Endpoints disponibles:**
- `GET /api/users` (requiere JWT)
- `GET /api/users/me` (requiere JWT)

**Probar:**
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### v0.8.0 - Seguridad adicional
**Qué incluye:**
- Rate limiting
- Mejoras en manejo de errores
- Logging mejorado
- Validaciones adicionales

**Dependencias nuevas:**
- express-rate-limit

---

### v0.9.0 - Testing
**Qué incluye:**
- Configuración de Jest + Supertest
- Tests de autenticación
- Tests de usuarios
- Tests de integración

**Comandos:**
```bash
npm test
npm run test:watch
npm run test:coverage
```

---

### v1.0.0 - Documentación y despliegue
**Qué incluye:**
- Documentación Swagger/OpenAPI
- Dockerfile para contenedor
- Scripts de despliegue
- README completo
- Guía de contribución

**Endpoints disponibles:**
- `GET /docs` - Documentación Swagger

**Despliegue:**
```bash
docker build -t api-express .
docker run -p 3000:3000 api-express
```

---

## 🚀 Inicio rápido

### Clonar y usar la última versión
```bash
git clone <repository>
cd node-server
npm install
cp .env.example .env
docker-compose up -d
npm run dev
```

### Empezar desde una versión específica
```bash
git checkout v0.2.0
npm install
npm run dev
```

## 📚 Documentación adicional

Cada versión incluye su propio README con detalles específicos de implementación y decisiones de diseño tomadas.

## 🔒 Seguridad

- **Roles y propietario:** `requireRole` (401 sin token, 403 si el rol no es el pedido) y `requireOwner` (404 si no existe, 403 si es de otro usuario).
- **CORS:** solo se aceptan los orígenes de `CORS_ORIGINS` (separados por comas). Las peticiones sin `Origin`, como las de la app Android, pasan. Un origen no permitido recibe 403.
- **Helmet:** cabeceras de seguridad en toda la API. En `/api-docs` se quita solo la Content-Security-Policy para que cargue Swagger UI.
- **Rate limiting:** 100 peticiones cada 15 minutos por IP y 5 intentos fallidos de login o registro cada 15 minutos (después, 429).
- **Logs:** los logins fallidos, los accesos denegados (rol o propietario) y los límites superados se guardan con Winston.
- **Errores:** en un 500 la respuesta solo dice "Error interno del servidor"; el detalle va al log. En `development` se muestra el mensaje.
- **Secretos:** `.env` no se sube. En producción `JWT_SECRET` es obligatorio y de al menos 32 caracteres. Para generar uno: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- **Dependencias:** `npm audit fix` aplicado. Quedan avisos en `prisma` (solo se arreglan con Prisma 7) y en `swagger-jsdoc` (lee los archivos de rutas al arrancar), que necesitan cambios de versión mayor.

## 🔧 Tecnologías

- Node.js + TypeScript
- Express
- PostgreSQL
- JWT para autenticación
- Zod para validación
- Docker para desarrollo
- Jest para testing

## 📝 Notas

Este proyecto está diseñado con propósitos educativos para aprender desarrollo de APIs REST paso a paso.

