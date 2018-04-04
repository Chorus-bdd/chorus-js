// @flow
import createClient from '../src';


const client = createClient('SimpleStepPublisher', 'A simple chorus step publisher');
export default client;

const urlParams = new URLSearchParams(window.location.search);
const chorusHostAndPort = urlParams.get('chorusHostAndPort');

export const clientOpened : Promise<void> = chorusHostAndPort ?
	client
		.open(`ws://${chorusHostAndPort}`)
		.then(() => client.connect()) :
	new Promise(() => {});
