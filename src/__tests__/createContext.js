// @flow
import createContext, { type Context } from '../createContext';


let context: Context = createContext({});

beforeEach(() => {
	context = createContext({ a: 1, b: 2 });
});

describe('createContext', () => {
	it('exports correctly', () => {
		expect(typeof createContext).toBe('function');
	});

	it('returns a `Context` object', () => {
		expect(context).toEqual(expect.objectContaining({
			get: expect.any(Function),
			set: expect.any(Function),
			toObject: expect.any(Function),
		}));
	});

	describe('get', () => {
		it('acts as a getter', () => {
			expect(context.get('a')).toBe(1);
			expect(context.get('b')).toBe(2);
			expect(context.get('c')).not.toBeDefined();
		});
	});

	describe('set', () => {
		it('acts as a setter', () => {
			context.set('a', 'hello');
			expect(context.get('a')).toBe('hello');
		});
	});

	describe('toObject', () => {
		it('outputs as an object', () => {
			const obj = context.toObject();
			expect(obj).toEqual({ a: 1, b: 2 });
		});
	});
});
