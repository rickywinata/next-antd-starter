export function isError(result: any): result is { error: string } {
	return (result as { error: string }).error !== undefined
}
