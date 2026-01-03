import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables. Please add it to your .env file.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false
});

// Test connection on startup
pool.on('connect', () => {
    console.log('PostgreSQL pool connected');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
});

export default pool;