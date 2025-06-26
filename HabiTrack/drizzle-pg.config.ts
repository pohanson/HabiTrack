import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config({ path: './.env' });

export default {
  schema: './db/pgSchema.ts',
  out: './drizzle/pg',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.EXPO_PUBLIC_PG_DATABASE_URL || '',
  },
} satisfies Config;
