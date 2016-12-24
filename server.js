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
var facilitiesRef = db.ref('facilities');
var requestsRef = db.ref('requests');

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.get('/users', function(req, res){
	res.setHeader('Content-Type', 'application/json');
  usersRef.once('value', function(snapshot){
  	res.send(JSON.stringify(snapshot.val()));
  });
});

app.post('/users', function(req, res){
	if ( req.body.hasOwnProperty("name") === true ){
		var newUser = req.body;
		
		firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
			.then(function(user){
				newUser.id = user.uid;
				newUser.role = "staff";
				delete newUser['password'];
				usersRef.push(newUser);
				res.cookie('currentUser', [newUser.id, newUser.name].toString());
				res.send({redirect: '/staff'});
			})
			.catch(function(error){
				res.send(error);
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
			  res.send(error.message);
			});
	}
});

app.get('/admin', function(req, res){
	if ( req.cookies.currentUser ){
		res.sendFile(path.join(__dirname, '/views', 'admin.html'));	
	}
	else{
		res.redirect('/');
	}	
});

app.post('/admin', function(req, res){
	res.cookie('currentUser', [req.body.id, req.body.name].toString());
	res.send({redirect: '/admin'});
});

app.get('/staff', function(req, res){
	if ( req.cookies.currentUser ){
		res.sendFile(path.join(__dirname, '/views', 'staff.html'));	
	}
	else{
		res.redirect('/');
	}	
});

app.post('/staff', function(req, res){
	res.cookie('currentUser', [req.body.id, req.body.name].toString());
	res.send({redirect: '/staff'});
});

app.get('/reports', function(req, res){
	res.setHeader('Content-Type', 'application/json');
  requestsRef.once('value', function(snapshot){
  	res.send(JSON.stringify(snapshot.val()));
  });
});

app.post('/reports', function(req, res){
	if ( req.body.status !== 'awaiting' ){
		requestsRef
			.orderByChild("description")
			.equalTo(req.body.description)
			.on('child_added', function(snapshot){
				requestsRef.child(snapshot.key)
					.update({
						status: req.body.status,
						staffAssigned: req.body.staffAssigned
					});
			});	
	}
	else{
		requestsRef.push(req.body);
	}
	res.send("ok");
});

app.get('/facilities', function(req, res){
	res.setHeader('Content-Type', 'application/json');
  facilitiesRef.once('value', function(snapshot){
  	res.send(JSON.stringify(snapshot.val()));
  });
});

app.post('/facilities', function(req, res){
	facilitiesRef.push(req.body);
	res.send('ok');
});

app.post('/logout', function(req, res){
	if ( req.cookies.currentUser ){
		res.clearCookie('currentUser');
	}
	res.send({redirect: '/'});
});

app.listen(port);
console.log('Maintenance Tracker Application Is Running On Port: '+ port);

exports = module.exports = app;