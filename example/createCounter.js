import expect from 'expect';
import client, { clientOpened } from './client';


export default function (rootElem) {
	let _value = 0;

	const _decrementButton = rootElem.querySelector('.decrement');
	const _incrementButton = rootElem.querySelector('.increment');
	const _valueSpan = rootElem.querySelector('.value');

	function _setValue(value) {
		_value = value;
		_valueSpan.innerText = value;
	}

	function _handleDecrementButtonClick() {
		_setValue(_value - 1);
	}

	function _handleIncrementButtonClick() {
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
		destroy() {
			_decrementButton.removeEventListener('click', _handleDecrementButtonClick);
			_incrementButton.removeEventListener('click', _handleIncrementButtonClick);
		},
	};
}
