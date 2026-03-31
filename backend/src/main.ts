import { NestFactory } from '@nestjs/core';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TrpcRouter } from './trpc/trpc.router';
import { TrpcModule } from './trpc/trpc.module';

async function bootstrap() {
  const app = await NestFactory.create(TrpcModule);

  app.enableCors();

  const trpcRouter = app.get(TrpcRouter);

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter.appRouter,
      createContext: () => ({}),
    }),
  );

  await app.listen(3001);
}

bootstrap();
