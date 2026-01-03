import "dotenv/config";
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables.');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('supabase') ? { rejectUnauthorized: false } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'akvashisht24@gmail.com' },
    update: { user_name: 'Akshat_24' },
    create: {
      email: 'akvashisht24@gmail.com',
      user_name: 'Akshat_24'
    }
  });
  console.log('Seeded user with email akvashisht24@gmail.com and user_name Akshat_24');
  console.log('User:', user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
