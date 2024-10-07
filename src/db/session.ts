import crypto from "crypto"
import { eq } from "drizzle-orm"
import { v7 as uuidv7 } from "uuid"
import db from "@/db/db"
import { session } from "@/db/schema"

export const updateSessionExpiry = async (id: string, newExpiryDate: Date) => {
	if (!id || !newExpiryDate) {
		return { error: "Invalid parameters" }
	}

	try {
		const result = await db
			.update(session)
			.set({ expiredAt: newExpiryDate })
			.where(eq(session.id, id))
			.returning()

		if (result.length > 0) {
			return { message: "Session expiry updated successfully" }
		} else {
			return { error: "Session not found" }
		}
	} catch (error) {
		return { error: "System error" }
	}
}

export const createSession = async (
	userEmail: string,
	userPictureUrl: string,
	expiredAt: Date,
	accessTokenHash: string,
) => {
	const now = new Date()
	const sessionData = {
		id: uuidv7(),
		userEmail,
		userPictureUrl,
		accessTokenHash,
		expiredAt,
		createdAt: now,
		updatedAt: now,
	}

	try {
		await db.insert(session).values(sessionData)
		return sessionData
	} catch (error) {
		console.error("insert db error: ", error)
		return { error: "Failed to create session" }
	}
}

export const deleteSession = async (accessToken: string) => {
	if (!accessToken) {
		return { error: "Invalid access token" }
	}

	const accessTokenHash = crypto
		.createHash("sha256")
		.update(accessToken)
		.digest("hex")

	try {
		const result = await db
			.delete(session)
			.where(eq(session.accessTokenHash, accessTokenHash))
			.returning()

		if (result.length > 0) {
			return { message: "Session deleted successfully" }
		} else {
			return { error: "Session not found" }
		}
	} catch (error) {
		return { error: "System error" }
	}
}
