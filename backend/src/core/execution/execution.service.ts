import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import {
  GetExecutionByIdInput,
  GetListExecutionInput,
  ResolveExecutionInput,
} from './execution.schema';
import { ExecutionStatus } from '@prisma/client';

@Injectable()
export class ExecutionService {
  constructor(private readonly prisma: PrismaService) {}

  list(data: GetListExecutionInput) {
    return this.prisma.execution.findMany({
      take: data.limit,
      skip: data.offset,
      where: {
        status: data.status,
        workflow: {
          name: data.workflowName,
        },
      },
      select: {
        id: true,
        status: true,
        values: true,
        createdAt: true,
        updatedAt: true,
        workflow: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getById(data: GetExecutionByIdInput) {
    return this.prisma.execution.findUnique({
      where: { id: data.id },
      include: {
        workflow: true,
      },
    });
  }

  resolve(data: ResolveExecutionInput) {
    return this.prisma.execution.update({
      where: { id: data.id },
      data: { status: ExecutionStatus.RESOLVED },
    });
  }
}
