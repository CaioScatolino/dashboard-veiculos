import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create mysql2 connection pool
const poolConnection = mysql.createPool(process.env.DATABASE_URL);

// Create drizzle instance with schema
export const db = drizzle(poolConnection, { schema, mode: 'default' });
