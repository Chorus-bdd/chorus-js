// @flow
import expect from 'expect';
import client, { clientOpened } from './client';


type Counter = {
	destroy(): void,
};

export default function (rootElem: HTMLElement): Counter {
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

	_decrementButton.addEventListener('click', _handleDecrementButtonClick);
	_incrementButton.addEventListener('click', _handleIncrementButtonClick);

	function _checkValue(expected) {
		expect(Number(expected)).toEqual(_value);
		return _value;
	}

	clientOpened.then(() => {
		client.publishStep('.* click.* decrement button', _handleDecrementButtonClick);
		client.publishStep('.* click.* increment button', _handleIncrementButtonClick);
		client.publishStep('.* counter value is (.*)', _checkValue);
		client.stepsAligned();
	});

	return {
		destroy(): void {
			_decrementButton.removeEventListener('click', _handleDecrementButtonClick);
			_incrementButton.removeEventListener('click', _handleIncrementButtonClick);
		},
	};
}
