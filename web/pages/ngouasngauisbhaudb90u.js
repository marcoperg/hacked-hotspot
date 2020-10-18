import { useEffect, useRef } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { client, w3cwebsocket as W3CWebSocket } from 'websocket';

export default function Home() {
	const ws = useRef(null);

	useEffect(() => {
		ws.current = new W3CWebSocket('ws://127.0.0.1:4000/', 'echo-protocol');

		ws.current.onerror = () => {
			console.log('Connection Error');
		};

		ws.current.onopen = () => {
			console.log('WebSocket Client Connected');
		};

		ws.current.onclose = () => {
			console.log('echo-protocol Client Closed');
		};
	}, []);

	function send(text) {
		if (ws.current.readyState === ws.current.OPEN) {
			ws.current.send(text);
		}
	}

	return (
		<Container>
			<Row className="mb-2">
				<Button variant="dark" onClick={() => send('rotation')}>
					Rotation
				</Button>
			</Row>
			<Row>
				<Button variant="dark" onClick={() => send('upsideDown')}>
					Upside down
				</Button>
			</Row>
		</Container>
	);
}
