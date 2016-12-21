var path = require('path');
module.exports = function(app){
	app.get('/admin', function(req,res){
		res.sendFile(path.join(__dirname, '../views', 'admin.html'));
	});
	app.get('/staff', function(req,res){
		res.sendFile(path.join(__dirname, '../views', 'member.html'));
	});
};