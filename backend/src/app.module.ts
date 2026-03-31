import { Module } from '@nestjs/common';
import { HealthModule } from './core/health/health.module';
import { WorkflowModule } from './core/workflow/workflow.module';
import { TrpcModule } from './trpc/trpc.module';
import { ExecutionModule } from './core/execution/execution.module';

@Module({
  imports: [HealthModule, WorkflowModule, ExecutionModule, TrpcModule],
})
export class AppModule {}
