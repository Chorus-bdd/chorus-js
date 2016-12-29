import makeUUID from 'uuid/v4';
import { connect, publishStep, stepsAligned, stepSucceeded, stepFailed } from './messages';


export default function (clientId, clientDescription = '') {
	if (!clientId) {
		throw new Error('Please provide `clientId`');
	}

	let _socket = null;
	const _callbacks = {};

	function _sendMessage(message) {
		_socket.send(
			JSON.stringify(message),
		);
	}

	function _onMessage(event) {
		const message = JSON.parse(event.data);

		if (message.type === 'EXECUTE_STEP') {
			const callback = _callbacks[message.stepId];
			if (callback) {
				const { stepId, executionId, contextVariables } = message;
				try {
					const result = callback(...message.arguments);
					_sendMessage(
						stepSucceeded(clientId, stepId, executionId, result, contextVariables),
					);
				} catch (e) {
					_sendMessage(
						stepFailed(clientId, stepId, executionId, e.message),
					);
				}
			}
		}
	}

	return {
		open(url) {
			return new Promise((resolve, reject) => {
				_socket = new WebSocket(url);
				_socket.addEventListener('open', resolve);
				_socket.addEventListener('error', reject);
				_socket.addEventListener('message', _onMessage);
			});
		},

		close() {
			_socket.close();
		},

		connect() {
			_sendMessage(
				connect(clientId, clientDescription),
			);
		},

		publishStep(pattern, callback, technicalDescription, pendingMessage) {
			const stepId = makeUUID();
			_callbacks[stepId] = callback;
			_sendMessage(
				publishStep(clientId, stepId, pattern, pendingMessage, technicalDescription),
			);
		},

		stepsAligned() {
			_sendMessage(
				stepsAligned(clientId),
			);
		},
	};
}
