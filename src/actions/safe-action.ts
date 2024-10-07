import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createSafeActionClient,
} from "next-safe-action"

export const actionClient = createSafeActionClient({
	handleReturnedServerError(e) {
		return DEFAULT_SERVER_ERROR_MESSAGE
	},
})
