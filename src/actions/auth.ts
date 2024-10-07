"use server"

import crypto from "crypto"
import { nanoid } from "nanoid"
import { cookies } from "next/headers"
import { getUserByEmail } from "@/db/queries"
import { createSession, deleteSession } from "@/db/session"
import { isError } from "@/lib/typeguards"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""

export const login = async (authzToken: string) => {
	const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			code: authzToken,
			client_id: GOOGLE_CLIENT_ID,
			client_secret: GOOGLE_CLIENT_SECRET,
			redirect_uri: "postmessage",
			grant_type: "authorization_code",
		}),
	})
	if (!tokenResponse.ok) {
		console.error("Failed to fetch token:", await tokenResponse.text())
		return { error: "Failed to fetch token" }
	}

	const tokenData = await tokenResponse.json()
	const idToken = tokenData.id_token

	const userInfoResponse = await fetch(
		`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`,
	)
	if (!userInfoResponse.ok) {
		console.error("Failed to fetch user info:", await userInfoResponse.text())
		return { error: "Failed to fetch user info" }
	}

	const userInfo = await userInfoResponse.json()
	if (!userInfo.email_verified) {
		return { error: "Email not verified" }
	}

	const userEmail = userInfo.email

	const userResult = await getUserByEmail(userEmail)
	if (isError(userResult)) {
		return { code: "user_missing", error: "user is not found" }
	}

	const userPictureUrl = userInfo.picture
	const sevenDaysInSecs = 7 * 24 * 60 * 60
	const expiredAt = new Date(Date.now() + sevenDaysInSecs * 1000) // 7 days from now
	const accessToken = nanoid(32)
	const accessTokenHash = crypto
		.createHash("sha256")
		.update(accessToken)
		.digest("hex")

	const sessionResult = await createSession(
		userEmail,
		userPictureUrl,
		expiredAt,
		accessTokenHash,
	)
	if (isError(sessionResult)) {
		return { error: sessionResult.error }
	}

	// Set cookies

	cookies().set("accessToken", accessToken, {
		httpOnly: true,
		path: "/",
		maxAge: sevenDaysInSecs,
	})

	cookies().set("userPictureUrl", userPictureUrl, {
		httpOnly: false,
		path: "/",
		maxAge: sevenDaysInSecs,
	})

	return { accessToken }
}

export const logout = async () => {
	const accessToken = cookies().get("accessToken")?.value
	if (!accessToken) {
		return { error: "Access token is required" }
	}

	const result = await deleteSession(accessToken)
	if (result.error) {
		return { error: result.error }
	}

	// Set the cookie to expire immediately
	cookies().set("accessToken", "", { path: "/", expires: new Date(0) })

	return { message: "Logout successful" }
}
