import { PostgresStore } from '@mastra/pg';

export const pStore = new PostgresStore({
  id: 'dentalcore-store',
  connectionString: process.env.DATABASE_URL!,
});
