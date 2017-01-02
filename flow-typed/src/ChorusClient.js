interface ChorusClient {
	open(url: string): Promise<Event>,
	close(): void,
	connect(): void,
	publishStep(
		pattern: string,
		callback: (...args: Array<string>) => number | string | void,
		technicalDescription?: string,
		pendingMessage?: string,
	): void,
	stepsAligned(): void,
}
