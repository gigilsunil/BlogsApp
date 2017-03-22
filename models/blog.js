//Load Mongoose package
var mongoose = require('mongoose');

//Connect to MongoDB and create the database blogApp
//mongoose.connect('mongodb://localhost/blogApp');

//Create a schema
var blogSchema = new mongoose.Schema({
	title : String,
	categories : String,
	content : String,
	updated_At :{type : Date,
				 default : Date.now	}
});

//Create a model based on the schema
module.exports = mongoose.model('Blog',blogSchema);