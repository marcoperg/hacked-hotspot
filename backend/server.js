// Require modules
const app = require('express')();
const expressWs = require('express-ws')(app);
const cors = require('cors');

// Import controllers
const { websocket, getConnectedUsers } = require('./controllers/websocket');

// Middlewares
app.use(cors());

app.get('/', function (req, res, next) {
	console.log('get route');
	res.send({ message: 'hello world', statusCode: 200 });
});

app.get('/users', getConnectedUsers);

app.ws('/', websocket);

app.use((err, req, res, next) => {
	console.log(err);

	res.status(500);
	res.send({ status: 'error', message: err.message });
});

app.listen(4000, () => {
	console.log('Listening on `http://127.0.0.1:4000`');
});
