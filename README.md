# API Express + PostgreSQL - Proyecto Incremental

Este proyecto implementa una API REST con Node.js, Express y PostgreSQL siguiendo un desarrollo incremental versionado con Git tags.

## 📖 Documentación de la API

La API dispone de documentación interactiva mediante Swagger UI.

Con el servidor en ejecución, puedes acceder a ella desde:

- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Desde esta página puedes consultar los endpoints disponibles, sus parámetros, los cuerpos de petición y las respuestas, además de probar las operaciones de la API.

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

## 🗄️ Configuración de bases de datos

El backend permite trabajar con dos opciones de PostgreSQL:

- **PostgreSQL local mediante Docker:** recomendado para desarrollo local.
- **PostgreSQL alojado en Supabase:** permite trabajar con una base de datos compartida en la nube.

### Requisitos previos

- Node.js y npm.
- Docker Desktop (para utilizar PostgreSQL local).
- Acceso al proyecto de Supabase (para utilizar PostgreSQL alojado).

### 1. Instalar dependencias

Clona el repositorio e instala las dependencias:

```bash
git clone <repository>
cd RepairLinkApi
npm install
```

### 2. Configurar las variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

En Windows PowerShell puedes utilizar:

```powershell
Copy-Item .env.example .env
```

Configura las variables de conexión en `.env`:

```env
DATABASE_URL="URL_DE_CONEXION"
DIRECT_URL="URL_DE_CONEXION_DIRECTA"
```

**Importante:** el archivo `.env` contiene credenciales privadas. No debe subirse a GitHub ni compartirse con otros usuarios.

### 3. Utilizar PostgreSQL local con Docker

Para iniciar la base de datos local:

```bash
docker compose up -d
```

Configura `DATABASE_URL` con la dirección de PostgreSQL local definida en `docker-compose.yml`.

Mantén `DIRECT_URL` configurada según la conexión local cuando sea necesaria.

### 4. Utilizar PostgreSQL alojado en Supabase

Crea un proyecto en Supabase y obtén las cadenas de conexión desde la opción **Connect**.

Configura:

- `DATABASE_URL`: conexión Transaction Pooler.
- `DIRECT_URL`: conexión Session Pooler, para las operaciones de migración.

Introduce ambas direcciones en el archivo `.env`, sustituyendo los valores de ejemplo por las credenciales de tu proyecto.

No incluyas las credenciales reales en `.env.example`.

### 5. Aplicar las migraciones

Una vez configurada la conexión a la base de datos deseada, ejecuta:

```bash
npx prisma migrate deploy
```

Para comprobar el estado de las migraciones:

```bash
npx prisma migrate status
```

### 6. Arrancar el backend

```bash
npm run dev
```

La API estará disponible en:

```text
http://localhost:3000
```

La documentación interactiva estará disponible en:

```text
http://localhost:3000/api-docs
```

### 7. Ejecutar los tests

```bash
npm test
```

Los tests utilizan la configuración de `.env.test`, independiente de la conexión principal de desarrollo.

### 8. Configuración en otro ordenador

Cada integrante del equipo debe:

1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Crear su propio archivo `.env` a partir de `.env.example`.
4. Configurar las variables de entorno con las credenciales facilitadas de forma segura.
5. Aplicar las migraciones con `npx prisma migrate deploy`.
6. Arrancar el backend con `npm run dev`.

Las credenciales de Supabase deben compartirse de forma segura y nunca mediante commits o archivos públicos.

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

