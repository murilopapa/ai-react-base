import { z } from 'zod';

export const ErrorSchema = z.object({
  name: z.string(),
  message: z.string(),
  action: z.string().optional(),
  status_code: z.number(),
  details: z
    .object({
      issues: z.array(z.any()),
      method: z.string(),
      url: z.string(),
    })
    .optional(),
  error_code: z.string().optional(),
});

export type ApiError = z.infer<typeof ErrorSchema>;
