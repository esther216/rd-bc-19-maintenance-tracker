var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var firebase = require('firebase');

var port = process.env.PORT || 8080;
var config = require('./config/db.js').config;

var app = express();

firebase.initializeApp(config);

var db = firebase.database();
var usersRef = db.ref('users');
var facilitesRef = db.ref('facilities');
var requestsRef = db.ref('requests');
var thisUser;

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

//app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.post('/logout', function(req, res){
	if ( req.cookies.currentUser ){
		res.clearCookie('currentUser');
	}
	res.send({redirect: '/'});
});

app.get('/admin', function(req, res){
	if ( req.cookies.currentUser ){
		res.sendFile(path.join(__dirname, '/views', 'member.html'));	
	}
	else{
		res.redirect('/');
	}	
});

app.get('/staff', function(req,res){
	if ( req.cookies.currentUser ){
		res.sendFile(path.join(__dirname, '/views', 'member.html'));	
	}
	else{
		res.redirect('/');
	}			
});

app.post('/staff', function(req, res){
	var userData = [ req.body.id, req.body.name ];
	res.cookie('currentUser', userData.toString());
	res.send({redirect: '/staff'});
});

app.get('/users', function(req, res){
	res.setHeader('Content-Type', 'application/json');
  usersRef.on('value', function(snapshot){
  	res.send(JSON.stringify(snapshot.val()));
  });
});

app.post('/users', function(req, res){
	if (req.body.hasOwnProperty("name") === true ){
		var newUser = req.body;
		firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
			.then(function(user){
				newUser.id = user.uid;
				newUser.role = "staff";
				delete newUser['password'];
				usersRef.push(newUser);
				res.send({redirect: '/staff'});
			})
			.catch(function(error){
				console.log(error);
			});
	}
	else{
		firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
			.then(function(currentUser){
				var email = currentUser.email;
				var data = usersRef.orderByChild('email').equalTo(email);
				data.once('value', function(snapshot){
					res.send(JSON.stringify(snapshot.val()));
				});
				
			})
			.catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  console.log(errorMessage);
			});
	}
});

app.post('/requests',  function(req, res){
	var newRequest = req.body;
	newRequest.status = "awaiting";
	newRequest.staffAssigned = "none";
	requestsRef.push(newRequest);
});

app.listen(port);
console.log('Maintenance Tracker Application Is Running On Port: '+ port);

exports = module.exports = app;