import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create workflows with closed executions
  await prisma.workflow.create({
    data: {
      id: 'random-workflow-seed-id-1',
      name: 'High Temperature Alert',
      type: 'THRESHOLD',
      exitMessage: 'Temperature is too high: {{valor}}°C',
      attributes: {
        metric: 'Temperature',
        operator: '>',
        value: 100,
      },
      active: true,
      recipients: {
        create: [
          { channel: 'IN_APP', recipientValue: 'admin' },
          { channel: 'EMAIL', recipientValue: 'admin@example.com' },
        ],
      },
      executions: {
        create: {
          id: 'random-execution-seed-id-1',
          values: { value: 50 },
          status: 'RESOLVED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create workflows with open executions
  await prisma.workflow.create({
    data: {
      id: 'random-workflow-seed-id-2',
      name: 'CPU Usage Variance',
      type: 'VARIANCE',
      exitMessage: 'CPU usage fluctuated significantly: {{valor}}%',
      active: true,
      recipients: {
        create: [{ channel: 'IN_APP', recipientValue: 'devops' }],
      },
      attributes: {
        percentage: 10,
        value: 50,
      },
      executions: {
        create: {
          id: 'random-execution-seed-id-2',
          values: { desviacion: 'CPU', valor: 100 },
          status: 'OPEN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
