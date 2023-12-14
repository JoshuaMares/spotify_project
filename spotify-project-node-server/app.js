const express = require('express');
const morgan = require('morgan');
const mongoURI = require('../mongo_info.js');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes.js');

//init server
const app = express();

//connect to mongodb
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('connected to db');
        app.listen(3000);//dont want to listen until we actually connect
    })
    .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');
//app.set('views', 'myviews');

//middleware and static files
app.use(express.static('public'));
//folder named public will be accessible to browser
//typically used for files linked by other files we have paths to
app.use(express.urlencoded({'extended': true}))
app.use(morgan('dev'));

//mongoose & mongo sanbox routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    //res.send('<p>about page</p>');
    res.render('about', {'title': 'about'});
});

app.use('/blogs', blogRoutes);
//scoping to blogs so we dont have to go /blogs/... in blogroutes

//404
app.use((req, res) => {
    res.status(404).render('404', {'title': '404'});
    //like a switch where we check all possible routes from top to bottom
    //and if we reach this function its like the default
});
