import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Client } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Use 'any' for the options object if you use adapter-based connection (like pg)
  constructor() {
    // 3. Create the driver instance
    const dbUrl = process.env.DATABASE_URL;
    const client = new Client({ connectionString: dbUrl });

    // 4. Create the adapter instance
    const adapter = new PrismaPg(client);

    // 5. Pass the adapter to the super constructor
    super({ adapter });
    // You can also add logging here: super({ adapter, log: ['query', 'error'] });
  }

  // NOTE: If using the adapter-pg, you'll need a different constructor.
  // For standard usage, use the simplified version above.

  async onModuleInit() {
    // This is required to establish the connection
    await this.$connect();
  }

  async onModuleDestroy() {
    // This ensures connections are closed on shutdown
    await this.$disconnect();
  }

  // Optional: A helper for graceful shutdown in development (e.g., NestJS HMR)
  // This helps prevent 'too many connections' errors during watch mode.
  // enableShutdownHooks(app: INestApplication) {
  //   this.$on('beforeExit', async () => {
  //     await app.close();
  //   });
  // }
}
