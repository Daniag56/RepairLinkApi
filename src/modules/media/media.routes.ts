import { Router } from 'express';
import multer from 'multer';
import { auth } from '../../middleware/auth.js';
import { uploadCtrl, listCtrl, getByIdCtrl, deleteCtrl } from './media.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  },
});

router.post('/upload', auth, upload.single('file'), uploadCtrl);
router.get('/', auth, listCtrl);
router.get('/:id', auth, getByIdCtrl);
router.delete('/:id', auth, deleteCtrl);

export default router;
