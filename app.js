
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , cors = require('cors')
  ,fs = require('fs')
  , https = require('https'); 


var app = express();
const userService  = require('./services/userService');
const gameService  = require('./services/gameService');

// all environments
app.set('port', process.env.PORT || 3000);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(function (req, res, next) {
	  console.log('Time:', Date.now())
	  next()
});

/**
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Headers", "Content-Type");
next();
});**/


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.options('*', cors()) // include before other routes

app.get('/users/getUsers', cors(),function(req, res, next) {
	  let userServiceObj = new userService(req, res)
	  userServiceObj.getAllUsers();
	});

app.get('/users/findUsers',cors(),function(req, res, next) {
	  let userServiceObj = new userService(req, res)
	  userServiceObj.findUsers();
	});

app.post('/users/regsiterUser', cors(),function(req, res, next) {
	  let userServiceObj = new userService(req, res)
	  userServiceObj.regsiterUser();
	});

/**
app.post('/users/addUser', function (req, res) {
	  let userServiceObj = new userService(req, res)
	  userServiceObj.addUser();
	});
**/	

app.post('/users/clearUsers', cors(),function(req, res, next) {
	  let userServiceObj = new userService(req, res)
	  userServiceObj.removeAll();
	});



app.post('/users/updateUser', cors(),function(req, res, next) {
	  let userServiceObj = new userService(req, res)
	  userServiceObj.updateUser();
	});

app.post('/users/deleteUser', cors(), function(req, res, next) {
	  let userServiceObj = new userService(req, res)
	  userServiceObj.deleteUser();
	});

app.get('/users/payUsers', cors(), function(req, res, next) {
	  let userServiceObj = new userService(req, res)
	  userServiceObj.payUserBet();
	});

/*** game apis **/

app.get('/games/getGames', cors(),function(req, res, next) {
	  let serviceObj = new gameService(req, res);
	  serviceObj.getAllGames();
	});

app.post('/games/findGames', cors(),function(req, res, next) {
	  let serviceObj = new gameService(req, res);
	  serviceObj.findGames();
	});

app.get('/games/findBetInGames', cors(),function(req, res, next) {
	  let serviceObj = new gameService(req, res);
	  serviceObj.findGames();
	});


app.post('/games/addGame', cors(),function(req, res, next) {
	  let serviceObj = new gameService(req, res);
	  serviceObj.addGame();
	});

app.post('/games/clearGames', cors(),function(req, res, next) {
	  let serviceObj = new gameService(req, res);
	  serviceObj.removeAll();
	});

app.post('/games/updateGame', cors(),function(req, res, next) {
	  let serviceObj = new gameService(req, res);
	  serviceObj.updateGame();
	});

app.post('/games/deleteGame', cors(),function(req, res, next) {
	  let serviceObj = new gameService(req, res);
	  serviceObj.deleteGame();
	});  



http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});
