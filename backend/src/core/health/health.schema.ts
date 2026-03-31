import { z } from 'zod';

export const healthStatusSchema = z.object({
  status: z.literal('OK'),
  service: z.string(),
  version: z.string(),
  dependencies: z.object({
    database: z.string(),
    trpc: z.string(),
  }),
  timestamp: z.iso.datetime(),
});

export type HealthStatus = z.infer<typeof healthStatusSchema>;