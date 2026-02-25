import process from 'node:process'
import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import * as schema from './schema'

export * from './schema'

const client = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle({ client, schema })
