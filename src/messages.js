export function connect(clientId, description) {
	return {
		type: 'CONNECT',
		chorusClientId: clientId,
		description,
	};
}

export function publishStep(clientId, stepId, pattern, pendingMessage, technicalDescription) {
	return {
		type: 'PUBLISH_STEP',
		chorusClientId: clientId,
		stepId,
		pattern,
		pendingMessage,
		technicalDescription,
	};
}

export function stepsAligned(clientId) {
	return {
		type: 'STEPS_ALIGNED',
		chorusClientId: clientId,
	};
}

export function stepSucceeded(clientId, stepId, executionId, result, contextVariables) {
	return {
		type: 'STEP_SUCCEEDED',
		chorusClientId: clientId,
		stepId,
		executionId,
		result,
		contextVariables,
	};
}

export function stepFailed(clientId, stepId, executionId, description, errorText) {
	return {
		type: 'STEP_FAILED',
		chorusClientId: clientId,
		stepId,
		executionId,
		description,
		errorText,
	};
}
