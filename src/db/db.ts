import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const POSTGRES_URL = process.env.POSTGRES_URL || ""

const client = postgres(POSTGRES_URL)

const db = drizzle(client)

export default db
