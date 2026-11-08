
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RepairLink API',
      version: '1.0.0',
      description:
        'API REST de RepairLink con autenticación JWT, validación Zod, rate limiting y pruebas automatizadas.',
      contact: {
        name: 'RepairLink Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Servidor de desarrollo',
      },
    ],
   
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID del usuario' },
            email: { type: 'string', format: 'email', description: 'Email del usuario' },
            name: { type: 'string', description: 'Nombre del usuario' },
            createdAt: { type: 'string', format: 'date-time', description: 'Fecha de creación' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['email', 'name', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string', minLength: 2 },
            password: { type: 'string', minLength: 8 },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', description: 'JWT token' },
          },
        },
        UpdateProfileInput: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string', minLength: 2 },
          },
        },
        ChangePasswordInput: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', minLength: 8 },
            newPassword: { type: 'string', minLength: 8 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID de la tarea' },
            title: { type: 'string', description: 'Título de la tarea' },
            description: {
              type: 'string',
              nullable: true,
              description: 'Descripción de la tarea',
            },
            done: {
              type: 'boolean',
              description: 'Indica si la tarea está completada',
              default: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            userId: {
              type: 'integer',
              nullable: true,
              description: 'ID del usuario asociado',
            },
          },
        },
        CreateTaskInput: {
          type: 'object',
          required: ['title', 'userId'],
          properties: {
            title: { type: 'string', minLength: 3 },
            description: { type: 'string', maxLength: 500 },
            userId: { type: 'integer', minimum: 1 },
          },
        },
        UpdateTaskInput: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3 },
            description: {
              type: 'string',
              maxLength: 500,
              nullable: true,
            },
            done: {
              type: 'boolean',
              description: 'Indica si la tarea está completada',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación',
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios',
      },
      {
        name: 'Tasks',
        description: 'Gestión de tareas',
      },
    ],
  },
  apis:
      env.NODE_ENV === 'production'
        ? ['./dist/modules/*/*.routes.js']
        : ['./src/modules/*/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
