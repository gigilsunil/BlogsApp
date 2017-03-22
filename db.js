//Load Mongoose package
var mongoose = require('mongoose');

//Connect to MongoDB and create the database blogApp
//mongoose.connect('mongodb://localhost/blogApp');

//Create a schema
var blogSchema = new mongoose.schema({
	title : String,
	categories : String,
	content : String
});

//Create a model based on the schema
//var Blog = mongoose.model('Blog',blogSchema);