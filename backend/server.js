require('dotenv').config();

const client_keys = require('../private_info/spotify_keys.ts');
const mongo_uri = require('../private_info/mongo_info.js');
const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const cors = require("cors");
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user.js');

//init
const app = express();

//middleware
const corsOptions = {'origin': 'http://localhost:5173'};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('PATH: ', req.path);
    console.log('METHOD: ', req.method);
    next();
});

//routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.json({'mssg': 'Welcome to the app'});
});

app.post('/callback', (req, res) => {
    console.log('req body: ', req.body);
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
        //console.log('error: ', error);
        //console.log('response: ', response);
        console.log('data: ', data);
        if(error){
            console.log('we have an error');
            res.status(502).send('server error');
        }else{
            res.status(200).send(data);
        }
    });
})

mongoose.connect(mongo_uri)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })