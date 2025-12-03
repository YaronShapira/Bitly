import { defineConfig } from '@prisma/config';

console.log(process.env.DATABASE_URL);
export default defineConfig({
  schema: './schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
