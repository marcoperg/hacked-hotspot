// Require modules
const app = require('express')();
const expressWs = require('express-ws')(app);

// Import controllers
const { websocket } = require('./controllers/websocket');

app.get('/', function (req, res, next) {
	console.log('get route');
	res.end();
});

app.ws('/', websocket);

app.listen(4000, () => {
	console.log('Listening on `http://127.0.0.1:4000`');
});
