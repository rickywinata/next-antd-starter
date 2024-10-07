"use client"

import React, { Suspense, useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button, Card, Layout, Spin } from "antd"
import { notification } from "antd"
import { login as loginAction } from "@/actions/auth"
import { isError } from "@/lib/typeguards"

const Login: React.FC = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	let from = searchParams.get("from") || "/"
	if (Array.isArray(from)) {
		from = from[0]
	}
	const [isLoading, setIsLoading] = useState(false)

	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			setIsLoading(true)
			try {
				const res = await loginAction(codeResponse.code)
				if (isError(res)) {
					throw res
				}
				router.replace(from)
			} catch (err) {
				const errorMessage =
					isError(err) && err.error === "user is not found"
						? "User is not found"
						: "Something went wrong, please try again later"

				notification.error({
					message: errorMessage,
				})

				setIsLoading(false)
			}
		},
		onError: (_) => {
			notification.error({
				message: "Something is wrong, try again after a while",
			})

			setIsLoading(false)
		},
		flow: "auth-code",
	})

	return (
		<Layout>
			<div className="flex items-center justify-center min-h-screen bg-cf-bg-color">
				<Card bordered={false}>
					<div className="flex flex-col items-center px-12 py-6 text-center">
						<Image
							src="https://placehold.co/800x400.png?text=Logo"
							height={100}
							width={200}
							alt="Logo"
						/>
						<h2 className="m-1 mt-6">Sign in to Internal System</h2>
						<div className="mt-8">
							{isLoading ? (
								<Spin spinning />
							) : (
								<Button
									onClick={() => {
										login()
									}}
									icon={
										<Image
											height={24}
											width={24}
											className="float-left mr-2"
											src="/assets/google-logo.png"
											alt=""
										/>
									}
								>
									Sign in with Google
								</Button>
							)}
						</div>
					</div>
				</Card>
			</div>
		</Layout>
	)
}

const LoginWrapped: React.FC = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Login />
		</Suspense>
	)
}

export default LoginWrapped
