import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
	const accessToken = request.cookies.get("accessToken")?.value ?? ""
	const isAccessingLogin =
		request.nextUrl.pathname.startsWith("/login") ||
		request.nextUrl.pathname.startsWith("/api/v1/login")

	// Call checkSession to verify the access token
	const session = await checkSession(accessToken, request)
	if (!session.valid) {
		if (isAccessingLogin) {
			return NextResponse.next()
		}
		return NextResponse.redirect(new URL("/login", request.url))
	}

	// already logged in but accessing login page, redirect to dashboard
	if (isAccessingLogin) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	return NextResponse.next()
}

async function checkSession(accessToken: string, request: NextRequest) {
	if (!accessToken) {
		return { valid: false }
	}

	const checkSessionResponse = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/check-session`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ accessToken }),
		},
	)

	if (checkSessionResponse.status !== 200) {
		return { valid: false }
	}

	const checkSessionData = await checkSessionResponse.json()

	if (checkSessionData.status !== "ok") {
		return { valid: false }
	}

	return { valid: true }
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api/v1/check-session (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!check-session|_next/static|_next/image|assets|favicon.ico).*)",
	],
}
