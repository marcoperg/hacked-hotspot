import { useEffect, useRef } from 'react';
import { Container, Row, Button, Badge } from 'react-bootstrap';
import { client, w3cwebsocket as W3CWebSocket } from 'websocket';
import { useConnectedUsers } from '../hooks/useConnectedUsers';

export default function Home() {
	const ws = useRef(null);
	const [{ loading, error, data }, getData] = useConnectedUsers();

	console.log(loading, error, data);
	useEffect(() => {
		getData();

		ws.current = new W3CWebSocket(process.env.NEXT_PUBLIC_BACKEND_WS_URL, 'echo-protocol');

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
		<Container className="my-5 p-2 mx-0 w-100">
			<Row className="mb-2 m-0 w-100 p-0 d-flex justify-content-center">
				<Badge disable variant="dark" className=" h-100 m-0 w-100">
					Connected users: {(!loading && !error && data.connectedUsers) || 'loading...'}
				</Badge>
			</Row>
			<Row className="mb-2 m-0 w-100 p-0 d-flex justify-content-center">
				<Button block variant="dark" className="m-0 w-100" onClick={() => send('rotation')}>
					Rotation
				</Button>
			</Row>
			<Row className="mb-2 m-0 w-100 p-0">
				<Button block variant="dark" className="w-100" onClick={() => send('upsideDown')}>
					Upside down
				</Button>
			</Row>
		</Container>
	);
}
