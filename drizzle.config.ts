import { defineConfig } from "drizzle-kit"

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url:
			process.env.POSTGRES_URL ||
			"postgresql://postgres:password@localhost:5432/next-antd-starter",
	},
})
