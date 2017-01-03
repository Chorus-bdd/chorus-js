/* eslint-disable no-unused-vars */

type ConnectMessage = {|
	type: 'CONNECT',
	chorusClientId: string,
	description: string,
|}

type PublishStepMessage = {|
	type: 'PUBLISH_STEP',
	chorusClientId: string,
	stepId: string,
	pattern: string,
	pendingMessage?: string,
	technicalDescription?: string,
|}

type StepsAlignedMessage = {|
	type: 'STEPS_ALIGNED',
	chorusClientId: string,
|}

type StepSucceededMessage = {|
	type: 'STEP_SUCCEEDED',
	chorusClientId: string,
	stepId: string,
	executionId: string,
	result?: number | string | void,
	contextVariables: Object,
|}

type StepFailedMessage = {|
	type: 'STEP_FAILED',
	chorusClientId: string,
	stepId: string,
	executionId: string,
	description?: string,
	errorText?: string,
|}

type OutgoingMessage =
	ConnectMessage |
	PublishStepMessage |
	StepsAlignedMessage |
	StepSucceededMessage |
	StepFailedMessage;

type ExecuteStepMessage = {|
	type: 'EXECUTE_STEP',
	chorusClientId: string,
	stepId: string,
	executionId: string,
	pattern: string,
	arguments: Array<string>,
	timeoutPeriodSeconds: number,
	contextVariables: Object,
|}
