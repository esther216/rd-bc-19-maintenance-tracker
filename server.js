var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var firebase = require('firebase');
var app = express();

// config files
var config = require('./config/db').config;

firebase.initializeApp(config);

// set port
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

var db = firebase.database();

require('./app/routes')(app);

app.listen(port);
console.log('Maintenance Tracker Application Is Running On Port: '+ port);
console.log(firebase.app().name); 
console.log(app.options.credential === config.credential);
console.log(app.options.databaseURL === config.databaseURL);
exports = module.exports = app;


