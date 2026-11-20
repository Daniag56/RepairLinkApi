import 'dotenv/config';

const required = (v: string | undefined, k: string) => {
  if (!v) throw new Error(`Falta variable de entorno: ${k}`);
  return v;
};

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const JWT_SECRET = required(process.env.JWT_SECRET, 'JWT_SECRET');

if (NODE_ENV === 'production' && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en producción');
}

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  NODE_ENV,
  JWT_SECRET,
  DATABASE_URL: required(process.env.DATABASE_URL, 'DATABASE_URL'),
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin !== ''),
};

