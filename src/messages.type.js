// @flow
export type ConnectMessage = {|
	type: 'CONNECT',
	chorusClientId: string,
	description: string,
|}

// NOTE: We're using inexact type here because there's a bug where
// exact types are not compatible with the spreading operator
// https://github.com/facebook/flow/issues/1793
export type PublishStepMessage = {
	type: 'PUBLISH_STEP',
	chorusClientId: string,
	stepId: string,
	pattern: string,
	pendingMessage?: ?string,
	technicalDescription?: ?string,
	retryDuration?: ?number,
	retryInterval?: ?number,
}

export type StepsAlignedMessage = {|
	type: 'STEPS_ALIGNED',
	chorusClientId: string,
|}

export type StepSucceededMessage = {|
	type: 'STEP_SUCCEEDED',
	chorusClientId: string,
	stepId: string,
	executionId: string,
	result?: number | string | void,
	contextVariables: Object,
|}

export type StepFailedMessage = {|
	type: 'STEP_FAILED',
	chorusClientId: string,
	stepId: string,
	executionId: string,
	description?: string,
	errorText?: string,
|}

export type OutgoingMessage =
	ConnectMessage |
	PublishStepMessage |
	StepsAlignedMessage |
	StepSucceededMessage |
	StepFailedMessage;

export type ExecuteStepMessage = {|
	type: 'EXECUTE_STEP',
	chorusClientId: string,
	stepId: string,
	executionId: string,
	pattern: string,
	arguments: Array<string>,
	timeoutPeriodSeconds: number,
	contextVariables: Object,
|}
