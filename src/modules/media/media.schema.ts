import { z } from 'zod';

export const mediaSchema = z.object({
  id: z.number(),
  userId: z.number(),
  publicId: z.string(),
  secureUrl: z.string().url(),
  format: z.string(),
  resourceType: z.string(),
  bytes: z.number(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  originalName: z.string().nullable(),
  folder: z.string().nullable(),
  createdAt: z.date(),
});

export type Media = z.infer<typeof mediaSchema>;