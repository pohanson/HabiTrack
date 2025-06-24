import type { Config } from 'drizzle-kit';

export default {
  schema: './db/localSchema.ts',
  out: './drizzle/local',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
