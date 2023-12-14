const Blog = require('../models/blog.js');

//using model view controller (mvc)
//the model is the data model
//these are the controllers which tell use how to get the model data to the views
//the views are how we display the data to the user
const blog_index = (req, res) => {
    //combining mongo with ejs injection
    Blog.find().sort({'createdAt': -1})//descending order
        .then((result) => {
            res.render('index', {'title': 'home', 'blogs': result});
            //2nd object is injected into the ejs so we can use it
        });
}

const blog_details = (req, res) => {
    // //res.send('<p>about page</p>');
    // res.render('about', {'title': 'about'});
    const id = req.params.id;
    console.log(id);
    Blog.findById(id).then((result) => {
        res.render('details', {'blog': result, 'title': 'blog deets'})
    }).catch((err) => console.log(err));
}

const blog_create_get = (req, res) => {
    res.render('create', {'title': 'create'});
}

const blog_create_post = (req, res) => {
    console.log(req.body);
    const blog = new Blog(req.body);
    blog.save().then((result) => { 
        res.redirect('/');
    }).catch((err) => console.log(err));
}

const blog_delete = (req, res) => {
    const id = req.params.id;
    console.log('id is: ', id);
    Blog.findByIdAndDelete(id)
        .then((result) => {
            res.json({
                'redirect': '/'
            });
        }).catch((err) => console.log(err));
}

module.exports = {
    blog_index, 
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
}