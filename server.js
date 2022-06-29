const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const twilioAccountSid = 'AC97c478e19acebb21ee952f5dd0bcb639';
const twilioAuthToken = 'b3c91fa5f629f22baa66c64c71e61db4';
const twilioApiKey = 'SK9b1b24ca7fad40194af99d5b8d34a891';
const twilioApiSecret = 'WBUNephFkEo7neng03AAyT5yo3P9lodZ';

app.get('/api/token-service', (req, res) => {
	const AccessToken = require('twilio').jwt.AccessToken;

	const VideoGrant = AccessToken.VideoGrant;

	const videoGrant = new VideoGrant();

	const { identity } = req.query;

	// create an access token which we will sign with Twilio and we will return that to client
	const token = new AccessToken(
		twilioAccountSid,
		twilioApiKey,
		twilioApiSecret,
		{ identity: identity }
	);

	token.addGrant(videoGrant);

	const accessToken = token.toJwt();

	res.send({
		accessToken: accessToken,
	});
});

app.get('/api/room-exists', (req, res) => {
	const { roomId } = req.query;

	const client = require('twilio')(twilioAccountSid, twilioAuthToken);

	client.video
		.rooms(roomId)
		.fetch()
		.then((room) => {
			if (room) {
				res.send({
					roomExists: true,
					room,
				});
			} else {
				res.send({
					roomExists: false,
				});
			}
		})
		.catch((err) => {
			res.send({
				roomExists: false,
				err,
			});
		});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log('server started');
	console.log(`Listening at port ${PORT}`);
});
