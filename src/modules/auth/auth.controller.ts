 import type { Request, Response } from 'express';
  import { register, login } from './auth.service.js';
  import { registerSchema, loginSchema } from '../users/users.schema.js';
  import { logger } from '../../utils/logger.js';

  export async function registerCtrl(req: Request, res: Response) {
    try {
      const { email, name, password, role } = registerSchema.parse(req.body);
      const data = await register(email, name, password, role);
      res.status(201).json(data);
    } catch (e: any) {
      if (e.message === 'Email ya registrado') {
        return res.status(409).json({ message: e.message });
      }
      res.status(400).json({ message: e.message });
    }
  }

  export async function loginCtrl(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const data = await login(email, password);
      res.json(data);
    } catch (e: any) {
      if (e.message === 'Credenciales inválidas') {
        logger.warn(`Login fallido para ${req.body.email} desde ${req.ip}`);
        return res.status(401).json({ message: e.message });
      }
      res.status(400).json({ message: e.message });
    }
  }