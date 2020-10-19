import { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import Router from 'next/router';
import { client, w3cwebsocket as W3CWebSocket } from 'websocket';
import { html } from '../../../assets/spoofhtml/index.html.json';
import MIDIlovania from '../../../assets/MEGALOVANIA.mp3';

export default function Home() {
	const ws = useRef(null);

	const [rotation, setRotation] = useState(false);
	const [upsideDown, setUpsideDown] = useState(false);
	const [showSongButton, setShowSongButton] = useState(false);

	const [play, stop] = useSound(MIDIlovania);

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
		ws.current.onmessage = ({ data: unparsedData }) => {
			const data = JSON.parse(unparsedData);
			console.log(data);

			if (data.type === 'common') {
				switch (data.data) {
					case 'upsideDown':
						setUpsideDown(!upsideDown);
						break;

					case 'rotation':
						setRotation(!rotation);
						break;

					case 'reload':
						Router.reload();
						break;
				}
			} else if (data.data === 'megalovania') {
				setShowSongButton(true);
			}
		};
	}, [rotation, upsideDown]);

	const className = classNames({
		upsideDown: upsideDown,
		rotation: rotation,
	});

	return (
		<div>
			{showSongButton && (
				<Button variant="dark" style={{ height: '20rem' }} onClick={play} block>
					Play a song
				</Button>
			)}
			<div className={className} dangerouslySetInnerHTML={{ __html: html }}></div>
		</div>
	);
}
