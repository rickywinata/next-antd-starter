import crypto from "crypto"
import { eq } from "drizzle-orm"
import db from "@/db/db"
import { session, user } from "@/db/schema"

export const getSessionByAccessToken = async (accessToken: string) => {
	if (!accessToken) {
		return { error: "Invalid access token" }
	}

	const accessTokenHash = crypto
		.createHash("sha256")
		.update(accessToken)
		.digest("hex")

	try {
		const sessionData = await db
			.select()
			.from(session)
			.where(eq(session.accessTokenHash, accessTokenHash))
			.limit(1)

		if (sessionData.length > 0) {
			return sessionData[0]
		} else {
			return { error: "Session not found" }
		}
	} catch (error) {
		console.log(error)
		return { error: "Internal Server Error" }
	}
}

export const getUserByEmail = async (email: string) => {
	if (!email) {
		return { error: "Invalid email" }
	}

	try {
		const userData = await db
			.select()
			.from(user)
			.where(eq(user.email, email))
			.limit(1)

		if (userData.length > 0) {
			return userData[0]
		} else {
			return { error: "User not found" }
		}
	} catch (error) {
		console.log(error)
		return { error: "Internal Server Error" }
	}
}
