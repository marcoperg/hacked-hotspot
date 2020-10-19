let connects = [];

function getConnectedUsers(req, res, next) {
	try {
		res.send({ status: 'ok', connectedUsers: connects.length });
	} catch (error) {
		next(error);
	}
}

function websocket(ws, req) {
	connects.push(ws);

	ws.on('open', (s) => {
		console.log('Connected -', s);
	});

	ws.on('message', (msg) => {
		console.log('Received -', msg);
		console.log(connects.length);

		const data = JSON.parse(msg);

		if (data.type === 'common') {
			connects.forEach((socket) => {
				socket.send(JSON.stringify(data));
			});
		} else if (data.type === 'oneEach') {
			oneEach(data);
		}
	});

	ws.on('close', () => {
		connects = connects.filter((conn) => {
			return conn === ws ? false : true;
		});
	});

	ws.on('error', (error) => {
		console.log(error);
	});
}

function oneEach(msg) {
	if (msg.data === 'megalovania') {
		megalovania();
	}
}

function megalovania() {
	const song = require('../assets/megalovania.json');

	for (const note of song) {
		getRandomUser().send(note);
	}
	console.log(song);
}

function getRandomUser() {
	const randomIndex = Math.floor(Math.random() * connects.length);

	return connects[randomIndex];
}

module.exports = {
	websocket,
	getConnectedUsers,
};
