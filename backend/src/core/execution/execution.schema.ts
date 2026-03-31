import { z } from 'zod';
import { ExecutionStatus } from '@prisma/client';

export const GetExecutionByIdSchema = z.object({
  id: z.string(),
});

export const GetListExecutionSchema = z.object({
  limit: z.coerce.number().default(10).optional(),
  offset: z.coerce.number().default(0).optional(),
  workflowName: z.string().optional(),
  status: z.enum(ExecutionStatus).optional(),
});

export const ResolveExecutionByIdSchema = z.object({
  id: z.string(),
});

export type GetExecutionByIdInput = z.infer<typeof GetExecutionByIdSchema>;
export type GetListExecutionInput = z.infer<typeof GetListExecutionSchema>;
export type ResolveExecutionInput = z.infer<typeof ResolveExecutionByIdSchema>;
