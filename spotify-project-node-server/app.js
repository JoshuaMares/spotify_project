const express = require('express');
//init server
const app = express();

//register view engine
app.set('view engine', 'ejs');
app.set('views', 'myviews');

//listen for reqs
app.listen(3000);

app.get('/', (req, res) => {
    //res.send('<p>homepage</p>');
    res.sendFile('./views_old/index.html', {'root': __dirname});
    //send and sendfile auto sets content type header
    //for second file we need an absolute path so in options parameter
    //we set the root directory we are working from
});

app.get('/about', (req, res) => {
    //res.send('<p>about page</p>');
    res.sendFile('./views_old/about.html', {'root': __dirname});
});

//redirect
app.get('/about-me', (req, res) => {
    res.redirect('/about');
});

//404
app.use((req, res) => {
    res.status(404).sendFile('./views_old/404.html', {'root': __dirname});
    //like a switch where we check all possible routes from top to bottom
    //and if we reach this function its like the default
});
