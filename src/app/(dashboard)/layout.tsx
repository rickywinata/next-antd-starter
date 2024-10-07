"use client"

import React, { useEffect, useState } from "react"
import { UserOutlined } from "@ant-design/icons"
import Cookies from "js-cookie"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, Dropdown, Layout, Menu, MenuProps, theme } from "antd"
import { logout } from "@/actions/auth"

const { Header, Content } = Layout

const items = [
	{
		key: "1",
		label: "Home",
		path: "/", // Add path property
	},
	// {
	// 	key: "2",
	// 	label: "Second Page",
	// 	path: "/second-page", // Add path property
	// },
]

const DashboardLayout: React.FC = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const router = useRouter()
	const pathname = usePathname()
	const {
		token: { colorBgContainer },
	} = theme.useToken()

	const [userPictureUrl, setUserPictureUrl] = useState<string | null>(null)

	useEffect(() => {
		const pictureUrl = Cookies.get("userPictureUrl")
		setUserPictureUrl(pictureUrl || null)
	}, [])

	const handleMenuClick: MenuProps["onClick"] = (e) => {
		const item = items.find((item) => item.key === e.key)
		if (item && item.path) {
			router.push(item.path)
		}
	}
	const selectedKey = items.find((item) => item.path === pathname)?.key

	return (
		<Layout className="!min-h-screen">
			<Header
				className="flex items-center sticky top-0 z-[999]"
				style={{ background: colorBgContainer }}
			>
				<Image
					className="me-8"
					src="https://placehold.co/140x48.png?text=Logo"
					height={48}
					width={140}
					alt="Logo"
				/>

				<Menu
					theme="light"
					mode="horizontal"
					defaultSelectedKeys={[selectedKey || "1"]}
					items={items.map((item) => ({ key: item.key, label: item.label }))}
					onClick={handleMenuClick} // Add onClick handler
					className="!border-0"
					style={{ flex: 1, minWidth: 0 }}
				/>

				<div className="min-w-[110px] flex justify-end mr-4">
					<Dropdown
						placement="bottomRight"
						menu={{
							items: [
								{
									key: "logout",
									label: <div>Logout</div>,
									onClick: async () => {
										await logout()
										router.push("/login")
									},
								},
							],
						}}
					>
						<a className="leading-none" onClick={(e) => e.preventDefault()}>
							<Avatar
								size="large"
								icon={<UserOutlined />}
								src={userPictureUrl}
							/>
						</a>
					</Dropdown>
				</div>
			</Header>
			<Content className="px-12 py-6">{children}</Content>
		</Layout>
	)
}

export default DashboardLayout
