import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { PrismaService } from '../shared/prisma.service';

@Module({
  providers: [WorkflowService, PrismaService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
