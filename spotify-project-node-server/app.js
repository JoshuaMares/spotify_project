const express = require('express');
const morgan = require('morgan');
//init server
const app = express();

//register view engine
app.set('view engine', 'ejs');
//app.set('views', 'myviews');

//listen for reqs
app.listen(3000);

//middleware and static files
app.use(express.static('public'));
//folder named public will be accessible to browser
//typically used for files linked by other files we have paths to
app.use(morgan('dev'));

app.get('/', (req, res) => {
    const blogs = [
        {'title': 'mario', 'content': 'its a me'},
        {'title': 'yoshi', 'content': 'yoshi!'},
        {'title': 'toad', 'content': 'aaaaaaaa'}
    ]
    res.render('index', {'title': 'home', 'blogs': blogs});
    //2nd object is injected into the ejs so we can use it
});

app.get('/about', (req, res) => {
    //res.send('<p>about page</p>');
    res.render('about', {'title': 'about'});
});

app.get('/blogs/create', (req, res) => {
    res.render('create', {'title': 'create'});
})
//404
app.use((req, res) => {
    res.status(404).render('404', {'title': '404'});
    //like a switch where we check all possible routes from top to bottom
    //and if we reach this function its like the default
});
