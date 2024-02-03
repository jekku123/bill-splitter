import { sql } from '@vercel/postgres';
import { VercelPgDatabase, drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: VercelPgDatabase<typeof schema> | undefined;
}

let db: VercelPgDatabase<typeof schema>;

if (process.env.NODE_ENV === 'production') {
  db = drizzle(sql, { schema });
} else {
  if (!global.db) {
    global.db = drizzle(sql, { schema });
  }
  db = global.db;
}

export { db };
