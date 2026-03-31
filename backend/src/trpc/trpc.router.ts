import { Injectable } from '@nestjs/common';
import { router } from './trpc';
import { WorkflowService } from '../core/workflow/workflow.service';
import { HealthService } from '../core/health/health.service';
import { ExecutionService } from '../core/execution/execution.service';
import { createWorkflowRouter } from '../core/workflow/workflow.router';
import { createHealthRouter } from '../core/health/health.router';
import { createExecutionRouter } from '../core/execution/execution.router';

const appRouterDefinition = (
  workflowService: WorkflowService,
  healthService: HealthService,
  executionService: ExecutionService,
) =>
  router({
    workflow: createWorkflowRouter(workflowService),
    health: createHealthRouter(healthService),
    execution: createExecutionRouter(executionService),
  });

export type AppRouter = ReturnType<typeof appRouterDefinition>;

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly healthService: HealthService,
    private readonly executionService: ExecutionService,
  ) {}

  get appRouter() {
    return appRouterDefinition(
      this.workflowService,
      this.healthService,
      this.executionService,
    );
  }
}
