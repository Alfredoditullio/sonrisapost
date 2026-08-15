import { PostgresStore } from '@mastra/pg';

export const pStore = new PostgresStore({
  id: 'sonrisapost-store',
  connectionString: process.env.DATABASE_URL!,
});
