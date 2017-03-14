// @flow
export type ContextValue = number | string | boolean;
export type ContextVariables = { [string]: ContextValue };

export interface Context {
	get(key: string): void,
	set(key: string, value: ContextValue): void,
	toObject(): ContextVariables,
}

export default function (initialContext: ContextVariables): Context {
	const _context = { ...initialContext };

	return {
		get: (key: string): void => _context[key],
		set: (key: string, value: ContextValue): void => { _context[key] = value; },
		toObject: (): ContextVariables => ({ ..._context }),
	};
}
