import 'dotenv/config';

import { sql } from '@vercel/postgres';

import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { db } from './index';

async function main() {
  await migrate(db, { migrationsFolder: './migrations' });
  await sql.end();
}

main();
