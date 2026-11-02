import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { updateUserSchema } from './users.schema.js';
import { listUsersCtrl, getUserCtrl, updateUserCtrl, deleteUserCtrl } from './users.controller.js';

const router = Router();

router.get('/', listUsersCtrl);
router.get('/:id', getUserCtrl);
router.patch('/:id', validate(updateUserSchema), updateUserCtrl);
router.delete('/:id', deleteUserCtrl);

export default router;

