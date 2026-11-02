  import { Router } from 'express';
  import { registerCtrl, loginCtrl } from './auth.controller.js';

  const router = Router();

  router.post('/register', registerCtrl);
  router.post('/login', loginCtrl);

  export default router;