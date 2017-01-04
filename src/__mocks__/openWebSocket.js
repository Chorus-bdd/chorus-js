const openWebSocketModule = jest.genMockFromModule('../openWebSocket');

const SUCCESS_URL = 'ws://localhost';
const FAILING_URL = 'ws://localhost/oops';

function openWebSocketMock(url) {
	const _listeners = [];

	const socket = {
		addEventListener(eventName, callback) {
			_listeners.push({ eventName, callback });
		},
		emit(eventName) {
			setTimeout(() => {
				_listeners
					.filter(l => l.eventName === eventName)
					.forEach(l => l.callback({ type: eventName }));
			});
		},
		send() {},
		close() {},
		__simulateServerMessage() {
			setTimeout(() => {
				_listeners
					.filter(l => l.eventName === 'message')
					.forEach(l => l.callback({
						type: 'message',
						data: JSON.stringify({
							type: 'EXECUTE_STEP',
							chorusClientId: 'clientId',
							stepId: 'uuid',
							executionId: 'executionId',
							pattern: 'pattern',
							arguments: ['one', 'two', 'three'],
							timeoutPeriodSeconds: 60,
							contextVariables: {},
						}),
					}));
			});
		},
	};

	switch (url) {
		case SUCCESS_URL:
			socket.emit('open');
			break;

		case FAILING_URL:
			socket.emit('error');
			break;

		default:
			break;
	}

	return socket;
}

openWebSocketModule.default = openWebSocketMock;
openWebSocketModule.SUCCESS_URL = SUCCESS_URL;
openWebSocketModule.FAILING_URL = FAILING_URL;

module.exports = openWebSocketModule;
