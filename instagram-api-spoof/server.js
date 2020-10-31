const app = require('express')();

const text = require('./media.json');
app.get('/v1/feed/reels_tray/', (req, res) => {
	res.send(text);
});

app.listen(5000, () => {
	console.log('Listening on `http://127.0.0.1:5000`');
});
