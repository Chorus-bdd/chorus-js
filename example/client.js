import createClient from '../src';


const client = createClient('SimpleStepPublisher', 'A simple chorus step publisher');
export default client;

export const clientOpened =
	client
		.open('ws://localhost:9080')
		.then(() => client.connect());
