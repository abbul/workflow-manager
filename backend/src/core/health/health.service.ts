import { Injectable } from '@nestjs/common';
import { HealthStatus } from './health.schema';

@Injectable()
export class HealthService {
  getSystemStatus(): HealthStatus {
    return {
      status: 'OK',
      service: 'workflow-manager',
      version: '1.0.0',
      dependencies: {
        database: 'connected',
        trpc: 'connected',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
