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

	ws.on('message', (message) => {
		console.log('Received -', message);
		console.log(connects.length);

		connects.forEach((socket) => {
			socket.send(message);
		});
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

module.exports = {
	websocket,
	getConnectedUsers,
};
