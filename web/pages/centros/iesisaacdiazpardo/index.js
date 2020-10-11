import iesisaacdiazpardoHtml from '../../../assets/iesisaacdiazpardoHtml';
import { useState } from 'react';
import classNames from 'classnames';

export default function Home() {
	const [upsideDown, setUpsideDown] = useState(false);
	const [rotation, setRotation] = useState(false);

	function toogleUpsideDown() {
		setUpsideDown(!upsideDown);
	}
	function toogleRotation() {
		setRotation(!rotation);
	}

	const className = classNames({ upsideDown: upsideDown, rotation: rotation });

	return (
		<div>
			<button onClick={toogleUpsideDown}>Upside-down</button>
			<button onClick={toogleRotation}>Rotation</button>
			<div className={className} dangerouslySetInnerHTML={{ __html: iesisaacdiazpardoHtml }}></div>;
		</div>
	);
}
