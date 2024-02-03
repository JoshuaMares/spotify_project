require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const cors = require("cors");
const bodyParser = require('body-parser')

const userRoutes = require('./routes/user.js');
const mixersRoutes = require('./routes/mixers.js');

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
app.use('/mixers', mixersRoutes);

app.get('/', (req, res) => {
    res.json({'mssg': 'Welcome to the app'});
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })