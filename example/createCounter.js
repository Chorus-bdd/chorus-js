// @flow
import expect from 'expect';
import client, { clientOpened } from './client';


type Counter = {
	destroy(): void,
};

export default function (rootElem: ?HTMLElement): Counter {
	if (!rootElem) { throw new Error('Cannot find `rootElem`'); }

	let _value: number = 0;

	const _decrementButton: HTMLElement | null = rootElem.querySelector('.decrement');
	const _incrementButton: HTMLElement | null = rootElem.querySelector('.increment');
	const _valueSpan: HTMLElement | null = rootElem.querySelector('.value');

	if (!_decrementButton || !_incrementButton || !_valueSpan) {
		throw new Error('Cannot find necessary elements');
	}

	function _setValue(value: number): void {
		_value = value;
		_valueSpan.innerText = String(value);
	}

	function _handleDecrementButtonClick(): void {
		_setValue(_value - 1);
	}

	function _handleIncrementButtonClick(): void {
		_setValue(_value + 1);
	}

	function _resetCounter() : void {
		_setValue(0);
	}

	_decrementButton.addEventListener('click', _handleDecrementButtonClick);
	_incrementButton.addEventListener('click', _handleIncrementButtonClick);

	let _fakeSuccessValue = false;
	let _fakeErrorValue = false;

	clientOpened.then(() => {
		// simple regression steps
		client.publishStep('.*call a step with a result', () => 'hello!');
		client.publishStep('.*call a step without a result', () => {});
		client.publishStep('.*call a step which fails', () => { expect(true).toBe(false); });
		client.publishStep('.*call a step which succeeds asynchronously', () => {
			setTimeout(() => { _fakeSuccessValue = true; }, 500);
			expect(_fakeSuccessValue).toBe(true);
			return String(_fakeSuccessValue);
		}, {
			retryDuration: 1000,
		});
		client.publishStep('.*call a step which times out', () => {
			setTimeout(() => { _fakeErrorValue = true; }, 1000);
			expect(_fakeErrorValue).toBe(true);
			return String(_fakeErrorValue);
		}, {
			retryDuration: 500,
		});
		client.publishStep('.*in chorus-js \'(.*)\' has the value \'(.*)\'', ([name, value], context) => {
			expect(context.get(name)).toBe(value);
		});
		client.publishStep('.*set the \'(.*)\' variable to \'(.*)\' in chorus-js', ([name, value], context) => {
			context.set(name, value);
		});

		// app steps
		client.publishStep('.*click.* decrement button', _handleDecrementButtonClick);
		client.publishStep('.*click.* increment button', _handleIncrementButtonClick);
		client.publishStep('.*counter value is (.*)', ([value]) => {
			expect(Number(value)).toEqual(_value);
			return _value;
		});
		client.publishStep('.*reset the counter', _resetCounter);

		// done publishing
		client.stepsAligned();
	});

	return {
		destroy(): void {
			_decrementButton.removeEventListener('click', _handleDecrementButtonClick);
			_incrementButton.removeEventListener('click', _handleIncrementButtonClick);
		},
	};
}
