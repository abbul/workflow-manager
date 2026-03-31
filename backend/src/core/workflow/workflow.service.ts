import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import {
  CreateWorkflowInput,
  ExecuteWorkflowInput,
  GetListWorkflowInput,
  GetWorkflowByIdInput,
  SnoozeWorkflowInput,
  ToggleWorkflowInput,
} from './workflow.schema';
import { Prisma, ExecutionStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { STATUS_CODES } from '../../trpc/errors';

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWorkflowInput) {
    const { attributes, ...restOfData } = data;
    const attributesFormated =
      typeof attributes === 'object' ? attributes : Prisma.JsonNull;

    return await this.prisma.workflow.create({
      data: {
        ...restOfData,
        attributes: attributesFormated as Prisma.JsonNullValueInput,
      },
    });
  }

  async list(data: GetListWorkflowInput) {
    return await this.prisma.workflow.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        active: true,
        attributes: true,
        snoozedUntil: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: data.limit,
      skip: data.offset,
    });
  }

  async getById(data: GetWorkflowByIdInput) {
    return await this.prisma.workflow.findUnique({ where: { id: data.id } });
  }

  async toggle(data: ToggleWorkflowInput) {
    return await this.prisma.workflow.update({
      where: { id: data.id },
      data: { active: data.active },
    });
  }

  async execute(data: ExecuteWorkflowInput) {
    const now = new Date();
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: data.workflowId },
    });

    if (!workflow || workflow.active === false) {
      throw new TRPCError({
        message: 'Workflow is not active',
        code: STATUS_CODES.BAD_REQUEST,
      });
    }

    if (workflow.snoozedUntil && now < workflow.snoozedUntil) {
      throw new TRPCError({
        message: 'Workflow is snoozed',
        code: STATUS_CODES.BAD_REQUEST,
      });
    }

    const existingExecution = await this.prisma.execution.findMany({
      where: {
        workflowId: data.workflowId,
        status: ExecutionStatus.OPEN,
      },
    });

    if (existingExecution.length > 0) {
      throw new TRPCError({
        message: 'Workflow is already in process',
        code: STATUS_CODES.CONFLICT,
      });
    }

    const valuesFormated =
      typeof data.values === 'object' ? data.values : Prisma.JsonNull;

    return this.prisma.execution.create({
      data: {
        workflowId: data.workflowId,
        status: ExecutionStatus.OPEN,
        values: valuesFormated as Prisma.JsonNullValueInput,
        createdAt: new Date(),
      },
      select: {
        id: true,
        status: true,
      },
    });
  }

  async snooze(data: SnoozeWorkflowInput) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: data.id },
    });
    if (!workflow) {
      throw new TRPCError({
        message: 'Workflow not found',
        code: STATUS_CODES.BAD_REQUEST,
      });
    }
    let snoozedUntil: Date | null;
    if (data.minutes === 0) {
      snoozedUntil = null;
    } else {
      snoozedUntil = new Date(Date.now() + data.minutes * 60000);
    }
    return this.prisma.workflow.update({
      where: { id: data.id },
      data: { snoozedUntil },
      select: {
        id: true,
        snoozedUntil: true,
      },
    });
  }
}
