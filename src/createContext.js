// @flow
export type ContextValue = number | string | boolean;
export type ContextVariables = { [string]: ContextValue };

export interface ChorusContext {
	get(key: string): void,
	set(key: string, value: ContextValue): void,
	toObject(): ContextVariables,
}

export default function (initialContext: ContextVariables): ChorusContext {
	const _context = { ...initialContext };

	const context = {
		get: (key: string): void => _context[key],
		set: (key: string, value: ContextValue): void => { _context[key] = value; },
		toObject: (): ContextVariables => ({ ..._context }),
	};

	Object.freeze(context);

	return context;
}
