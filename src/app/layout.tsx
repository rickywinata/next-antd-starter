import { Suspense } from "react"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import Loading from "./loading"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Internal System",
	description: "",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Suspense fallback={<Loading />}>
					<AntdRegistry>{children}</AntdRegistry>
				</Suspense>
			</body>
		</html>
	)
}
