// @flow
import uuid from 'uuid';
import type {
	ConnectMessage,
	PublishStepMessage,
	StepsAlignedMessage,
	StepSucceededMessage,
	StepFailedMessage,
	OutgoingMessage,
	ExecuteStepMessage,
} from './messages.type';


export interface ChorusClient {
	open(url: string): Promise<Event>,
	close(): void,
	connect(): void,
	publishStep(
		pattern: string,
		callback: (...args: Array<string>) => number | string | void,
		technicalDescription?: string,
		pendingMessage?: string,
	): void,
	stepsAligned(): void,
}

export default function (clientId: string, clientDescription?: string = ''): ChorusClient {
	if (!clientId) {
		throw new Error('Please provide `clientId`');
	}

	let _socket: WebSocket;
	const _callbacks: {[stepId: string]: (...args: Array<string>) => number | string | void} = {};

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
			const { stepId, executionId, contextVariables } = incomingMessage;

			try {
				const result: number | string | void = callback(...incomingMessage.arguments);
				const message: StepSucceededMessage = {
					type: 'STEP_SUCCEEDED',
					chorusClientId: clientId,
					stepId,
					executionId,
					result,
					contextVariables,
				};
				_sendMessage(message);
			} catch (error) {
				const message: StepFailedMessage = {
					type: 'STEP_FAILED',
					chorusClientId: clientId,
					stepId,
					executionId,
				};
				_sendMessage(message);
			}
		}
	}

	const client: ChorusClient = {
		open(url: string): Promise<Event> {
			return new Promise((resolve, reject) => {
				_socket = new WebSocket(url);
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
			technicalDescription?: string,
			pendingMessage?: string,
		): void {
			const stepId = uuid.v4();
			_callbacks[stepId] = callback;

			const message: PublishStepMessage = {
				type: 'PUBLISH_STEP',
				chorusClientId: clientId,
				stepId,
				pattern,
				pendingMessage,
				technicalDescription,
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
