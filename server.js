var express = require('express');
var Blog = require('./models/blog.js');
var mongoose = require('mongoose');
var _ = require('underscore');

var parser = require('body-parser');

var app = express();
var PORT = process.env.PORT | 3000;

//required to parse the request body
app.use(parser.json());

var logClientIp =  function(req,res,next)
{
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log('Client IP : '+ip);
	next();
}

//middleware to log the clinet Ip.
app.use(logClientIp);


//Creates a new blog
app.post('/blogs', function(req, res) {
	//console.log(req.body);
	var body = _.pick(req.body, 'title', 'categories', 'content');
	Blog.create(body, function(err, blog) {
		if (err) console.log(err);
		res.json(blog);
	})
})

//Get  the list of blogs
app.get("/blogs", function(req,res)
{
	Blog.find(function(err, blogs)
	{
		if(err) console.log(err);
		res.json(blogs);
	})

})

//Get the list of blogs based on search
app.get("/search", function(req,res)
{
	var search = req.query.q;
	console.log(search);
	Blog.find({
		$or : [{title : {$regex :search , $options : 'i'}}, 
				{categories : {$regex :search , $options : 'i'}}, 
				{content : {$regex :search , $options : 'i'}}]
	},
	/*Blog.find({
		$or : [{categories:'beach'},
				{content:'messy'}]*/
		/*categories : {$regex :search , $options : 'i'}
	},*/
	function(err, blogs)
	{
		if(err) console.log(err);
		res.json(blogs);
	})

})

//Get the blog with id
app.get("/blogs/:id",function(req,res)
{
	Blog.findById(req.params.id,function(err, blog)
	{
		if(err) console.log(err);
		res.json(blog);
	})
})

//Delete the blog with id
app.delete("/blogs/:id",function(req,res)
{
	Blog.findByIdAndRemove(req.params.id,function(err, blog)
	{
		if(err) console.log(err);
		res.json(blog);
	})
})

//update the blog with id
app.put("/blogs/:id",function(req,res)
{
	var body = _.pick(req.body, 'title', 'categories', 'content');
	Blog.findByIdAndUpdate(req.params.id,body, function(err, blog)
	{
		if(err) console.log(err);
		res.json(blog);
	})
})

//Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library
mongoose.Promise=global.Promise;

//Connects to mongodb.Once the connection is useful, app listens for connection
mongoose.connect('mongodb://localhost/blogApp')
	.then(() => {
		console.log('connection successful');
		app.listen(PORT, function() {
			console.log('Express listening on port ' + PORT);
		});
	})
	.catch((err) => console.log(err));