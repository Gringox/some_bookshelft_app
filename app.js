// When the app starts
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Promise = require('bluebird');
 
var dbConfig = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'pedro',
    password: 'pedro',
    database: 'blog',
    charset: 'utf8'
  }
};
 
var knex = require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);
 
app.set('bookshelf', bookshelf);
 
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
};
 
app.use(allowCrossDomain);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());
 
// parse application/json
app.use(bodyParser.json());
 
// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
 
// elsewhere, to use the bookshelf client:
var bookshelf = app.get('bookshelf');
 
// {our model definition code goes here}
var Article = bookshelf.Model.extend({
  tableName: 'article'
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});


//routes
app.get('/',function(req,res){
	res.send("blog-api up and running");
});

/* GET /api/article */
app.get('/api/article',function(req,res){
	new Article().fetchAll()
	.then(function(articles){
		res.send(articles.toJSON());
	}).catch(function(error){
		console.log(error);
		res.send('An error occured');
	});
});

/* GET /api/article/:article_id */
app.get('/api/article/:article_id',function(req,res){
	var article_id=req.params.article_id;
	new Article().where('id',article_id)
	.fetch()
	.then(function(article){
		res.send(article.toJSON());
	}).catch(function(error){
		console.log(error);
		res.send('Error retrieving article');
	});
});

/* POST /api/article */
app.post('/api/article',function(req,res){
	var article=new Article({
		title:req.body.title,
		body:req.body.body,
		author:req.body.author
	});
	article.save().then(function(saved_article){
		res.send(saved_article.toJSON());
	}).catch(function(error){
		console.log(error);
		res.send('Error saving article')
	});
});
 
app.listen(3000, function() {
  console.log('Express started at port 3000');
});
