import { Module } from '@nestjs/common';
import { WorkflowModule } from '../core/workflow/workflow.module';
import { HealthModule } from '../core/health/health.module';
import { TrpcRouter } from './trpc.router';
import { ExecutionModule } from '../core/execution/execution.module';

@Module({
  imports: [WorkflowModule, HealthModule, ExecutionModule],
  providers: [TrpcRouter],
  exports: [TrpcRouter],
})
export class TrpcModule {}
