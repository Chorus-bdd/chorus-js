// @flow
import * as index from '../index';


it('exports everything correctly', () => {
	const expected = {
		default: null,
	};

	expect(Object.keys(index)).toEqual(Object.keys(expected));

	Object.keys(index).forEach(key => {
		expect(index[key]).toBeDefined();
	});
});
