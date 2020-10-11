let connects = [];

function websocket(ws, req) {
	connects.push(ws);

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
};
