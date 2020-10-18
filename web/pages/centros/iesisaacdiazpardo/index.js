import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { client, w3cwebsocket as W3CWebSocket } from 'websocket';
import { html } from '../../../assets/spoofhtml/index.html.json';

export default function Home() {
	const ws = useRef(null);

	const [rotation, setRotation] = useState(false);
	const [upsideDown, setUpsideDown] = useState(false);

	useEffect(() => {
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

	useEffect(() => {
		ws.current.onmessage = ({ data }) => {
			switch (data) {
				case 'upsideDown':
					setUpsideDown(!upsideDown);
					break;

				case 'rotation':
					setRotation(!rotation);
					break;
			}
		};
	}, [rotation, upsideDown]);

	const className = classNames({ upsideDown: upsideDown, rotation: rotation });

	return (
		<div>
			<div className={className} dangerouslySetInnerHTML={{ __html: html }}></div>;
		</div>
	);
}
