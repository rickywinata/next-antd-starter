import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable(
	"user",
	{
		id: text("id").primaryKey(),
		email: text("email").notNull(),
	},
	(table) => ({
		emailIdx: index().on(table.email),
	}),
)

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		userEmail: text("userEmail").notNull(),
		userPictureUrl: text("userPictureUrl"),
		accessTokenHash: text("accessTokenHash").notNull().unique(),
		expiredAt: timestamp("expiredAt").notNull(),
		createdAt: timestamp("createdAt").notNull(),
		updatedAt: timestamp("updatedAt"),
		deletedAt: timestamp("deletedAt"),
	},
	(table) => ({
		accessTokenHashIdx: index().on(table.accessTokenHash),
	}),
)
