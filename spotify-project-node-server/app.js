const express = require('express');
const morgan = require('morgan');
const mongoURI = require('../mongo_info.js');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js');

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
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        'title': 'new blog 2',
        'snippet': 'about new blog',
        'body': 'body of blog',
    });
    blog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err));
})

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err));
})

app.get('/single-blog', (req, res) => {
    Blog.findById('657a591a1a9827525444b024')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => console.log(err));
})

app.get('/', (req, res) => {
    //combining mongo with ejs injection
    Blog.find().sort({'createdAt': -1})//descending order
        .then((result) => {
            res.render('index', {'title': 'home', 'blogs': result});
            //2nd object is injected into the ejs so we can use it
        })
});

app.get('/about', (req, res) => {
    //res.send('<p>about page</p>');
    res.render('about', {'title': 'about'});
});

app.post('/blogs', (req, res) => {
    console.log(req.body);
    const blog = new Blog(req.body);
    blog.save().then((result) => {
        res.redirect('/');
    }).catch((err) => console.log(err));
});

app.get('/blogs/create', (req, res) => {
    res.render('create', {'title': 'create'});
})

app.get('/blogs/:id', (req, res) => {
    // //res.send('<p>about page</p>');
    // res.render('about', {'title': 'about'});
    const id = req.params.id;
    console.log(id);
    Blog.findById(id).then((result) => {
        res.render('details', {'blog': result, 'title': 'blog deets'})
    }).catch((err) => console.log(err));
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    console.log('id is: ', id);
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({
                'redirect': '/'
            });
        }).catch((err) => console.log(err));
});

//404
app.use((req, res) => {
    res.status(404).render('404', {'title': '404'});
    //like a switch where we check all possible routes from top to bottom
    //and if we reach this function its like the default
});
