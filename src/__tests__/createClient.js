import createClient from '../createClient';
import { SUCCESS_URL, FAILING_URL } from '../__mocks__/openWebSocket';


jest.mock('../openWebSocket');
jest.mock('uuid', () => ({
	v4: () => 'uuid',
}));


// we need a bit of trickery to ensure the error handling
// works correctly with non-promise style async code.
// see this: https://github.com/facebook/jest/issues/2136
function fixAsyncErrorHandling(done, fn) {
	setTimeout(() => {
		try {
			fn();
			done();
		} catch (e) {
			done.fail(e);
		}
	}, 0);
}

describe('createClient', () => {
	it('exports correctly', () => {
		expect(typeof createClient).toBe('function');
	});

	it('returns a `Client` object', () => {
		const client = createClient('clientId', 'clientDescription');
		expect(typeof client.open).toBe('function');
		expect(typeof client.close).toBe('function');
		expect(typeof client.connect).toBe('function');
		expect(typeof client.publishStep).toBe('function');
		expect(typeof client.stepsAligned).toBe('function');
	});

	describe('`open`', () => {
		it('returns a promise', () => {
			const client = createClient('clientId', 'clientDescription');
			expect(client.open(SUCCESS_URL)).toBeInstanceOf(Promise);
		});

		it('resolves if WebSocket opens', () => {
			const client = createClient('clientId', 'clientDescription');
			return client.open(SUCCESS_URL).then(event => {
				expect(event.type).toBe('open');
			});
		});

		it('rejects if WebSocket errors', () => {
			const client = createClient('clientId', 'clientDescription');
			return client.open(FAILING_URL).catch(event => {
				expect(event.type).toBe('error');
			});
		});
	});

	describe('`close`', () => {
		it('returns early if the websocket does not exist', () => {
			const client = createClient('clientId', 'clientDescription');
			expect(client.close()).toBe(undefined);
		});

		it('calls `close` on the open websocket', () => {
			const client = createClient('clientId', 'clientDescription');

			return client.open(SUCCESS_URL).then(() => {
				const webSocket = client.getSocket();
				const closeSpy = jest.fn();
				webSocket.close = closeSpy;
				client.close();
				expect(closeSpy).toHaveBeenCalled();
			});
		});
	});

	describe('`connect`', () => {
		it('calls `send` on the open websocket', () => {
			const client = createClient('clientId', 'clientDescription');

			return client.open(SUCCESS_URL).then(() => {
				const webSocket = client.getSocket();
				const sendSpy = jest.fn();
				webSocket.send = sendSpy;
				client.connect();
				const message = {
					type: 'CONNECT',
					chorusClientId: 'clientId',
					description: 'clientDescription',
				};
				expect(sendSpy).toHaveBeenCalledWith(
					JSON.stringify(message),
				);
			});
		});
	});

	describe('`publishStep`', () => {
		it('calls `send` on the open websocket', () => {
			const client = createClient('clientId', 'clientDescription');

			return client.open(SUCCESS_URL).then(() => {
				const webSocket = client.getSocket();
				const sendSpy = jest.fn();
				webSocket.send = sendSpy;
				client.publishStep('pattern', () => {}, 'technicalDescription', 'pendingMessage');
				const message = {
					type: 'PUBLISH_STEP',
					chorusClientId: 'clientId',
					stepId: 'uuid',
					pattern: 'pattern',
					pendingMessage: 'pendingMessage',
					technicalDescription: 'technicalDescription',
				};
				expect(sendSpy).toHaveBeenCalledWith(
					JSON.stringify(message),
				);
			});
		});
	});

	describe('`stepsAligned`', () => {
		it('calls `send` on the open websocket', () => {
			const client = createClient('clientId', 'clientDescription');

			return client.open(SUCCESS_URL).then(() => {
				const webSocket = client.getSocket();
				const sendSpy = jest.fn();
				webSocket.send = sendSpy;
				client.stepsAligned();
				const message = {
					type: 'STEPS_ALIGNED',
					chorusClientId: 'clientId',
				};
				expect(sendSpy).toHaveBeenCalledWith(
					JSON.stringify(message),
				);
			});
		});
	});

	describe('executes steps and reports back', () => {
		it('executes the step callback', done => {
			const client = createClient('clientId', 'clientDescription');

			return client.open(SUCCESS_URL).then(() => {
				const webSocket = client.getSocket();
				const stepCallbackSpy = jest.fn();
				client.publishStep('pattern', stepCallbackSpy, 'technicalDescription', 'pendingMessage');
				webSocket.__simulateServerMessage();
				// simulate the wait for an async server message
				fixAsyncErrorHandling(done, () => {
					expect(stepCallbackSpy).toHaveBeenCalledWith('one', 'two', 'three');
				});
			});
		});

		it('reports a success', done => {
			const client = createClient('clientId', 'clientDescription');

			return client.open(SUCCESS_URL).then(() => {
				const webSocket = client.getSocket();
				const sendSpy = jest.fn();
				webSocket.send = sendSpy;
				client.publishStep('pattern', () => 3, 'technicalDescription', 'pendingMessage');
				webSocket.__simulateServerMessage();
				// simulate the wait for an async server message
				fixAsyncErrorHandling(done, () => {
					const message = {
						type: 'STEP_SUCCEEDED',
						chorusClientId: 'clientId',
						stepId: 'uuid',
						executionId: 'executionId',
						result: 3,
						contextVariables: {},
					};
					expect(sendSpy).toHaveBeenCalledWith(
						JSON.stringify(message),
					);
				});
			});
		});

		it('reports a failure', done => {
			const client = createClient('clientId', 'clientDescription');

			return client.open(SUCCESS_URL).then(() => {
				const webSocket = client.getSocket();
				const sendSpy = jest.fn();
				webSocket.send = sendSpy;
				client.publishStep('pattern', () => { throw new Error('not ok'); }, 'technicalDescription', 'pendingMessage');
				webSocket.__simulateServerMessage();
				fixAsyncErrorHandling(done, () => {
					const message = {
						type: 'STEP_FAILED',
						chorusClientId: 'clientId',
						stepId: 'uuid',
						executionId: 'executionId',
						description: undefined,
						errorText: undefined,
					};
					expect(sendSpy).toHaveBeenCalledWith(
						JSON.stringify(message),
					);
				});
			});
		});
	});
});
