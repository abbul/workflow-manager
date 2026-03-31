import { router, publicProcedure } from '../../trpc/trpc';
import { ExecutionService } from './execution.service';
import {
  GetListExecutionSchema,
  GetExecutionByIdSchema,
  ResolveExecutionByIdSchema,
} from './execution.schema';

export const createExecutionRouter = (executionService: ExecutionService) =>
  router({
    list: publicProcedure
      .input(GetListExecutionSchema)
      .query(({ input }) => executionService.list(input)),
    resolve: publicProcedure
      .input(ResolveExecutionByIdSchema)
      .mutation(({ input }) => executionService.resolve(input)),
    getById: publicProcedure
      .input(GetExecutionByIdSchema)
      .query(({ input }) => executionService.getById(input)),
  });
