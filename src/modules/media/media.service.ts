import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  id: number;
  publicId: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  width: number | null;
  height: number | null;
  originalName: string | null;
  folder: string | null;
  createdAt: Date;
}

export async function uploadMedia(
  userId: number,
  file: Express.Multer.File
): Promise<UploadResult> {
  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `user_${userId}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });

  const media = await prisma.media.create({
    data: {
      userId,
      publicId: result.public_id,
      secureUrl: result.secure_url,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
      width: result.width || null,
      height: result.height || null,
      originalName: file.originalname,
      folder: result.folder || null,
    },
  });

  return media;
}
