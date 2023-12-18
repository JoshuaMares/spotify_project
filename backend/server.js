require('dotenv').config()
const client_keys = require('../private_info/spotify_keys.ts');
const express = require('express');

const app = express();
app.listen(process.env.PORT, () => console.log('listening on port 4000'));

app.use((req, res, next) => {
    console.log('PATH: ', req.path);
    console.log('METHOD: ', req.method);
    next();
});

app.get('/', (req, res) => {
    res.json({'mssg': 'Welcome to the app'});
});

app.post('/callback', (req, res) => {
    console.log('body: ', req.body);
    const code = req.query.code || null;
    console.log('code: ', code)

    const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
        code: code,
        redirect_uri: 'http://localhost:5173/loading/',
        grant_type: 'authorization_code'
    },
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_keys.id + ':' + client_keys.secret).toString('base64'))
    },
    json: true
    };
    console.log('authOptions: ', authOptions);
})