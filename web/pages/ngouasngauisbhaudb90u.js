import { useEffect, useRef, useState } from 'react';
import { Container, Row, Button, Badge } from 'react-bootstrap';
import { client, w3cwebsocket as W3CWebSocket } from 'websocket';
import { useConnectedUsers } from '../hooks/useConnectedUsers';

export default function Home() {
	const ws = useRef(null);
	const [{ loading, error, data }, getData] = useConnectedUsers();
	const [fireworksAvailable, setFireworksAvailable] = useState(true);

	useEffect(() => {
		ws.current = new W3CWebSocket(
			process.env.NEXT_PUBLIC_BACKEND_WS_URL,
			'echo-protocol'
		);

		ws.current.onerror = () => {
			console.log('Connection Error');
		};

		ws.current.onopen = () => {
			console.log('WebSocket Client Connected');
			getData();
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

	function rotation() {
		const msg = { type: 'common', data: 'rotation' };
		send(JSON.stringify(msg));
	}

	function upsideDown() {
		const msg = { type: 'common', data: 'upsideDown' };
		send(JSON.stringify(msg));
	}

	function fireworks() {
		setFireworksAvailable(false);
		setTimeout(() => setFireworksAvailable(true), 4000);

		const msg = { type: 'common', data: 'fireworks' };
		send(JSON.stringify(msg));
	}

	function reload() {
		const msg = { type: 'common', data: 'reload' };
		send(JSON.stringify(msg));
	}

	function megalovania() {
		const msg = { type: 'oneEach', subtype: 'song', data: 'megalovania' };
		send(JSON.stringify(msg));
	}

	function instagram() {
		const msg = { type: 'redirect', data: 'instagram', userName: 'test' };
		send(JSON.stringify(msg));
	}

	return (
		<Container className='my-5 p-2 mx-0 w-100'>
			<Row className='mb-2 m-0 w-100 p-0 d-flex justify-content-center'>
				<Badge disable variant='dark' className=' h-100 m-0 w-100'>
					Connected users:{' '}
					{(!loading &&
						!error &&
						`you and ${data.connectedUsers - 1} others`) ||
						'loading...'}
				</Badge>
			</Row>

			{/* <Row className='mt-4 m-0 w-100 p-0 d-flex justify-content-center'> */}
			{/* <h5>Movement</h5> */}
			{/* </Row> */}
			<Row className='mb-2 m-0 w-100 p-0 d-flex justify-content-center'>
				<Button
					block
					variant='dark'
					className='m-0 w-100'
					onClick={rotation}>
					Rotation
				</Button>
			</Row>
			<Row className='mb-2 m-0 w-100 p-0'>
				<Button
					block
					variant='dark'
					className='w-100'
					onClick={upsideDown}>
					Upside down
				</Button>
			</Row>

			{/* <Row className='mt-4 m-0 w-100 p-0 d-flex justify-content-center'> */}
			{/* <h5>Animations</h5> */}
			{/* </Row> */}
			<Row className='mb-2 m-0 w-100 p-0'>
				<Button
					block
					variant='dark'
					className='w-100'
					disabled={!fireworksAvailable}
					onClick={fireworks}>
					Fireworks
				</Button>
			</Row>

			{/* <Row className='mt-4 m-0 w-100 p-0 d-flex justify-content-center'> */}
			{/* <h5>Sounds</h5> */}
			{/* </Row> */}
			<Row className='mb-2 m-0 w-100 p-0'>
				<Button
					block
					variant='dark'
					className='w-100'
					onClick={megalovania}>
					Megalovania
				</Button>
			</Row>

			{/* <Row className='mt-4 m-0 w-100 p-0 d-flex justify-content-center'> */}
			{/* <h5>Redirections</h5> */}
			{/* </Row> */}
			<Row className='mb-2 m-0 w-100 p-0'>
				<Button
					block
					variant='dark'
					className='w-100'
					onClick={instagram}>
					Instagram
				</Button>
			</Row>

			{/* <Row className='mt-4 m-0 w-100 p-0 d-flex justify-content-center'> */}
			{/* <h5>Assistants</h5> */}
			{/* </Row> */}
			<Row className='mb-2 m-0 w-100 p-0'>
				<Button block variant='dark' className='w-100' onClick={reload}>
					Reload
				</Button>
			</Row>
			<Row className='mb-2 m-0 w-100 p-0'></Row>
		</Container>
	);
}
