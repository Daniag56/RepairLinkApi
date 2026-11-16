import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { updateUserSchema, updateProfileSchema, changePasswordSchema } from './users.schema.js';
import { listUsersCtrl, getUserCtrl, meCtrl, updateUserCtrl, deleteUserCtrl, updateProfileCtrl, changePasswordCtrl } from './users.controller.js';

const router = Router();

router.get('/', auth, listUsersCtrl);
router.get('/me', auth, meCtrl);
router.patch('/me', auth, validate(updateProfileSchema), updateProfileCtrl);
router.patch('/me/password', auth, validate(changePasswordSchema), changePasswordCtrl);

router.get('/:id', auth, getUserCtrl);
router.patch('/:id', auth, validate(updateUserSchema), updateUserCtrl);
router.delete('/:id', auth, deleteUserCtrl);

export default router;

