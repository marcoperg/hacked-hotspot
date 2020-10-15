import { iesisaacdiazpardoHtml, iesisaacdiazpardoHead } from '../../../assets/iesisaacdiazpardoHtml';
import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import { client, w3cwebsocket as W3CWebSocket } from 'websocket';

export default function Home() {
	const ws = useRef(null);

	const [rotation, setRotation] = useState(false);
	const [upsideDown, setUpsideDown] = useState(false);

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
			<Head dangerouslySetInnerHTML={{ __html: iesisaacdiazpardoHead }}></Head>
			<div className={className} dangerouslySetInnerHTML={{ __html: iesisaacdiazpardoHtml }}></div>;
		</div>
	);
}
