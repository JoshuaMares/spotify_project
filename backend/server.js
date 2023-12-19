require('dotenv').config()
const client_keys = require('../private_info/spotify_keys.ts');
const express = require('express');
const request = require('request');
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();
app.listen(process.env.PORT, () => console.log('listening on port 4000'));

const corsOptions = {'origin': 'http://localhost:5173'};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('PATH: ', req.path);
    console.log('METHOD: ', req.method);
    next();
});

app.get('/', (req, res) => {
    res.json({'mssg': 'Welcome to the app'});
});

app.post('/callback', (req, res) => {
    console.log('req body: ', req.body);
    console.log('req signal: ', req.signal);
    const code = req.body.code || null;
    if(code == null){
        res.status(400).send('no code provided');
    }
    console.log('code: ', code);

    const authParameters = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_keys.id + ':' + client_keys.secret).toString('base64'))
    },
    form: {
        code: code,
        redirect_uri: 'http://localhost:5173/loading/',
        grant_type: 'authorization_code'
    },
    json: true
    };
    console.log('authParameters: ', authParameters);
    request(authParameters, (error, response, data) => {
        console.log('error: ', error);
        console.log('response: ', response);
        console.log('data: ', data);
        if(error){
            console.log('we have an error');
            res.status(502).send('server error');
        }else{
            res.send(data);
        }
    });
})