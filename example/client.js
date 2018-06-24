// @flow
import createClient from '../src';

const client = createClient('SimpleStepPublisher', 'A simple chorus step publisher');
export default client;

// Detect whether chorus was enabled by getting a http param in the URL when loading the app
const urlParams = new URLSearchParams(window.location.search);
const chorusEnabled = urlParams.get('chorusEnabled');

// If Chorus was enabled we need to open a connection to the Chrous interpreter which
// is running in the container named 'chorus-interpreter' on port 9080
export const clientOpened : Promise<void> = chorusEnabled ?
	client
		.open('ws://chorus-interpreter:9080')
		.then(() => client.connect()) :
	new Promise(() => {});
