import { type NextRequest } from "next/server"
import { getSessionByAccessToken } from "@/db/queries"
import { updateSessionExpiry } from "@/db/session"
import { isError } from "@/lib/typeguards"

export async function POST(request: NextRequest) {
	const { accessToken } = await request.json()

	if (!accessToken) {
		return new Response(JSON.stringify({ error: "unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		})
	}

	const sessionData = await getSessionByAccessToken(accessToken)
	if (isError(sessionData)) {
		return new Response(JSON.stringify({ error: "unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		})
	}

	const now = new Date()
	if (sessionData.expiredAt < now) {
		return new Response(JSON.stringify({ error: "unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		})
	}

	// Extend session expiry by 7 days
	const newExpiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
	await updateSessionExpiry(sessionData.id, newExpiryDate)

	return new Response(JSON.stringify({ status: "ok" }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	})
}
