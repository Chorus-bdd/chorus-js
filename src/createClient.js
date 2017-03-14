// @flow
import uuid from 'uuid';
import type {
	StepCallbackReturn,
	ConnectMessage,
	PublishStepMessage,
	StepsAlignedMessage,
	StepSucceededMessage,
	StepFailedMessage,
	OutgoingMessage,
	ExecuteStepMessage,
} from './shared-types';
import createContext, { type ContextVariables, type Context } from './createContext';
import openWebSocket from './openWebSocket';


type PublishStepMessageOptions = {
	pendingMessage?: string,
	technicalDescription?: string,
	retryDuration?: number,
	retryInterval?: number,
}

type StepCallback = (Array<string>, Context) => StepCallbackReturn;

export interface ChorusClient {
	getSocket(): WebSocket,
	open(url: string): Promise<Event>,
	close(): void,
	connect(): void,
	publishStep(
		pattern: string,
		callback: StepCallback,
		options?: PublishStepMessageOptions,
	): void,
	stepsAligned(): void,
}

export default function (clientId: string, clientDescription?: string = ''): ChorusClient {
	if (!clientId) {
		throw new Error('Please provide `clientId`');
	}

	let _socket: WebSocket;
	const _callbacks: { [stepId: string]: StepCallback } = {};

	function _sendMessage(message: OutgoingMessage): void {
		if (!_socket) { return; }
		_socket.send(
			JSON.stringify(message),
		);
	}

	function _onMessage(event: Event) {
		if (typeof event.data !== 'string') {
			throw new Error('Expecting websocket message data to be of type string');
		}
		const incomingMessage: ExecuteStepMessage = JSON.parse(event.data);

		if (incomingMessage.type === 'EXECUTE_STEP') {
			const callback = _callbacks[incomingMessage.stepId];
			const { stepId, executionId, arguments: args, contextVariables } = incomingMessage;

			const contextVars: ContextVariables = contextVariables;
			const context: Context = createContext(contextVars);
			try {
				const result: StepCallbackReturn = callback(args, context);
				const updatedContextVariables = context.toObject();
				const message: StepSucceededMessage = {
					type: 'STEP_SUCCEEDED',
					chorusClientId: clientId,
					stepId,
					executionId,
					result,
					contextVariables: updatedContextVariables,
				};
				_sendMessage(message);
			} catch (error) {
				const message: StepFailedMessage = {
					type: 'STEP_FAILED',
					chorusClientId: clientId,
					stepId,
					executionId,
					description: error.message,
				};
				_sendMessage(message);
			}
		}
	}

	const client: ChorusClient = {
		// we unfortunately have to expose the private socket publicly
		// so that we can spy on its methods in our tests
		getSocket(): WebSocket {
			return _socket;
		},

		open(url: string): Promise<Event> {
			return new Promise((resolve, reject) => {
				_socket = openWebSocket(url);
				_socket.addEventListener('open', resolve);
				_socket.addEventListener('error', reject);
				_socket.addEventListener('message', _onMessage);
			});
		},

		close(): void {
			if (!_socket) { return; }
			_socket.close();
		},

		connect(): void {
			const message: ConnectMessage = {
				type: 'CONNECT',
				chorusClientId: clientId,
				description: clientDescription,
			};
			_sendMessage(message);
		},

		publishStep(
			pattern: string,
			callback: Function,
			options?: PublishStepMessageOptions = {},
		): void {
			const stepId = uuid.v4();
			_callbacks[stepId] = callback;

			const message: PublishStepMessage = {
				type: 'PUBLISH_STEP',
				chorusClientId: clientId,
				stepId,
				pattern,
				...options,
			};
			_sendMessage(message);
		},

		stepsAligned(): void {
			const message: StepsAlignedMessage = {
				type: 'STEPS_ALIGNED',
				chorusClientId: clientId,
			};
			_sendMessage(message);
		},
	};

	return client;
}
