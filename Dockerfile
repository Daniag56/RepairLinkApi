# Construir la aplicación: instala todas las dependencias y compila TypeScript.
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@11.6.2
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Eliminar dependencias que solo se necesitan para desarrollo
RUN npm prune --omit=dev

# Imagen de producción: contiene solo lo necesario para ejecutar la API, sin herramientas de desarrollo como Jest o TypeScript.
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

ENV NODE_ENV=production

# Crear la carpeta de logs y asignar permisos al usuario node
RUN mkdir -p /app/logs && chown -R node:node /app

USER node

EXPOSE 3000
# dumb-init ayuda a gestionar correctamente los procesos del contenedor.
CMD ["dumb-init", "node", "dist/index.js"]
