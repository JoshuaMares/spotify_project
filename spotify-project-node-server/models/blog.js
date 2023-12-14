const mongoose = require('mongoose');
const Schema = mongoose.Schema;//constructor function

//schema defined structure of docs
const blogSchema = new Schema({
    'title': {
        'type': String,
        'required': true,
    },
    'snippet': {
        'type': String,
        'required': true,
    },
    'body': {
        'type': String,
        'required': true,
    }
}, {'timestamps': true});//autoassigns timestamps to objects

//model surrounds schema and gives us interface for schema
const Blog = mongoose.model('Blog', blogSchema);
//will automatically pluralize it (blogs) and search for that in collections

module.exports = Blog;