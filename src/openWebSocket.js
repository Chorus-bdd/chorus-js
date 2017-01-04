// @flow
export default function (url: string): WebSocket {
	return new window.WebSocket(url);
}
