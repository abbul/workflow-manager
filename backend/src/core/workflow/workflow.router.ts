import { router, publicProcedure } from '../../trpc/trpc';
import { WorkflowService } from './workflow.service';
import {
  CreateWorkflowSchema,
  GetWorkflowByIdSchema,
  GetListWorkflowSchema,
  ToggleWorkflowSchema,
  ExecuteWorkflowSchema,
  SnoozeWorkflowSchema,
} from './workflow.schema';

export const createWorkflowRouter = (workflowService: WorkflowService) =>
  router({
    list: publicProcedure
      .input(GetListWorkflowSchema)
      .query(({ input }) => workflowService.list(input)),
    getById: publicProcedure
      .input(GetWorkflowByIdSchema)
      .query(({ input }) => workflowService.getById(input)),
    create: publicProcedure
      .input(CreateWorkflowSchema)
      .mutation(({ input }) => workflowService.create(input)),
    toggle: publicProcedure
      .input(ToggleWorkflowSchema)
      .mutation(({ input }) => workflowService.toggle(input)),
    execute: publicProcedure
      .input(ExecuteWorkflowSchema)
      .mutation(({ input }) => workflowService.execute(input)),
    snooze: publicProcedure
      .input(SnoozeWorkflowSchema)
      .mutation(({ input }) => workflowService.snooze(input)),
  });
