import React from "react"
import { Spin } from "antd"

const LoadingPage = () => {
	return (
		<div className="h-screen flex justify-center items-center">
			<Spin spinning />
		</div>
	)
}

export default LoadingPage
