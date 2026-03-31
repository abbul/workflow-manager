import { z } from 'zod';
import { WorkflowType } from '@prisma/client';

export const CreateWorkflowSchema = z.object({
  name: z.string().min(3).max(250),
  type: z.enum(WorkflowType),
  metric: z.string(),
  attributes: z.unknown(),
  exitMessage: z.string().min(3).max(500),
  active: z.boolean().default(true),
});

export const GetWorkflowByIdSchema = z.object({
  id: z.string(),
});

export const GetListWorkflowSchema = z.object({
  limit: z.coerce.number().default(10).optional(),
  offset: z.coerce.number().default(0).optional(),
});

export const ToggleWorkflowSchema = z.object({
  id: z.string(),
  active: z.boolean(),
});

export const ExecuteWorkflowSchema = z.object({
  workflowId: z.string(),
  values: z.unknown(),
});

export const SnoozeWorkflowSchema = z.object({
  id: z.string(),
  minutes: z.number(),
});

export type CreateWorkflowInput = z.infer<typeof CreateWorkflowSchema>;
export type ExecuteWorkflowInput = z.infer<typeof ExecuteWorkflowSchema>;
export type GetWorkflowByIdInput = z.infer<typeof GetWorkflowByIdSchema>;
export type GetListWorkflowInput = z.infer<typeof GetListWorkflowSchema>;
export type ToggleWorkflowInput = z.infer<typeof ToggleWorkflowSchema>;
export type SnoozeWorkflowInput = z.infer<typeof SnoozeWorkflowSchema>;
