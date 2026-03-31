import { router, publicProcedure } from '../../trpc/trpc';
import { HealthService } from './health.service';

export const createHealthRouter = (healthService: HealthService) =>
  router({
    check: publicProcedure.query(() => {
      return healthService.getSystemStatus();
    }),
  });
