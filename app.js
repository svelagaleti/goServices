var express = require('express');
var Cloudant = require('cloudant');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var me = 'raghupatruni175';
var password = '7416133133';
var cloudant = Cloudant({
	account : me,
	password : password
});

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

	// null and undefined are "empty"
	if (obj == null) {
		return true;
	}

	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length > 0) {
		return false;
	}
	if (obj.length === 0) {
		return true;
	}

	// Otherwise, does it have any properties of its own?
	// Note that this doesn't handle
	// toString and valueOf enumeration bugs in IE < 9
	for ( var key in obj) {
		if (hasOwnProperty.call(obj, key)) {
			return false;
		}
	}

	return true;
}
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
app.get('/*', function(req, res) {
	res.sendFile(__dirname + '/public/' + 'login.html');
});

app.post('/login', function(req, res) {
	var doc = req.body.Email;
	var pword = req.body.Password;
	console.log(doc);
	console.log(pword);
	var db = cloudant.db.use('userregister');
	db.get(doc, function(err, data) {
		if(isEmpty(data))
			res.send("wrongUserName");
		else{
			var val = JSON.stringify(data);
			var i = JSON.parse(val);
			if(i.password !== pword){
				res.send("wrongPassword");
			}else{
				res.send("login");
			}
		}
	});
});
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
});


