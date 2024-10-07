CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userEmail" text NOT NULL,
	"userPictureUrl" text,
	"accessTokenHash" text NOT NULL,
	"expiredAt" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp,
	"deletedAt" timestamp,
	CONSTRAINT "session_accessTokenHash_unique" UNIQUE("accessTokenHash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_accessTokenHash_index" ON "session" USING btree ("accessTokenHash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_index" ON "user" USING btree ("email");