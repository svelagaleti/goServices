var express = require("express");
var google = require("googleapis");
var app = express();

app.use(express.static('static'));

var server = app.listen(3000,function(){
var host = server.address().address;
var port = server.address().port;
  console.log('Example app listening at http://localhost:3000/');

});

var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2("79083583763-4efbqks3da7t9dkqmlndu624g4980n0i.apps.googleusercontent.com", "Gxae-o9b6kJZxqu7O1pcK1mY", "http://localhost:3000/oauthcallback");


var scopes = [
 'https://www.googleapis.com/auth/gmail.modify'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', 
  scope: scopes 
});


app.get("/url", function(req, res){
res.send(url);
});

app.get("/tokens",function(req, res){
	var code = req.query.code;
	console.log(code);
	oauth2Client.getToken(code, function(err,tokens){
		if (err){
            console.log(err);
			res.send(err);
			return;
		}
		console.log("allright!!!!");
		console.log(err);
		console.log(tokens);
		oauth2Client.setCredentials(tokens);
		
		
		res.send(tokens);
		
	});
});
