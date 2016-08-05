var express = require('express');
var Cloudant = require('cloudant');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var me = 'navya175';
var password = '8897054977';
var cloudant = Cloudant({
	account : me,
	password : password
});
var smtpTransport = nodemailer.createTransport(smtpTransport({
	host : "smtp.gmail.com",
	secureConnection : false,
	port : 587,
	auth : {
		user : "goservice.org@gmail.com",
		pass : "goService@2016"
	}
}));
// create a new express server
var app = express();
var dbUser = cloudant.db.use('userregister');
var dbService = cloudant.db.use('servicereg');
var cfenv = require('cfenv');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
// var appEnv = cfenv.getAppEnv();
app.get('/*', function(req, res) {
	res.sendFile(__dirname + '/public/' + 'loginPage.html');
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
function getRandomCode() {
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789";
	var rand;
	var charec = '';
	for (var i = 0; i < 8; i++) {
		rand = Math.floor(Math.random() * str.length);
		charec += str.charAt(rand);
	}
	console.log(charec);
	return charec;
}
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv

app.post('/login', function(req, res) {
	var doc = req.body.Email;
	var pword = req.body.Password;
	console.log(doc);
	console.log(pword);
	var dbUser = cloudant.db.use('userregister');
	var dbService = cloudant.db.use('servicereg');
	dbUser.get(doc, function(err, data) {
		if (isEmpty(data)) {
			dbService.get(doc, function(err, data1) {
				if (isEmpty(data1)) {
					res.send("wrongUserName");
				} else {
					var val = JSON.stringify(data1);
					var i = JSON.parse(val);
					if (i.password !== pword) {
						res.send("wrongPassword");
					} else {
						res.send(i._id + " " + i.fullName);
					}
				}
			});
		} else {
			var val = JSON.stringify(data);
			var i = JSON.parse(val);
			if (i.password !== pword) {
				res.send("wrongPassword");
			} else {
				res.send(i._id + " " + i.fullName);
			}
		}
	});
});
app.post('/forgotPassword', function(req, res) {
	var Email = req.body.Email;
	var randomPassword = getRandomCode();
	var dbUser = cloudant.db.use('userregister');
	var dbService = cloudant.db.use('servicereg');
	dbUser.get(Email, function(err, data) {
		if (isEmpty(data)) {
			dbService.get(Email, function(err, data) {
				var loginJson = JSON.stringify(data);
				var loginStringJSON = JSON.parse(loginJson);

				// sending random password to mail here
				var mailOptions = {
					from : "goservice.org@gmail.com",
					to : Email,
					subject : "Re: Password Forgotten Request from goservice",
					text : "Your new Password is : " + randomPassword
				};
				console.log(mailOptions);
				smtpTransport.sendMail(mailOptions, function(error, response) {
					if (error) {
						console.log(error);
						res.end("error");
					} else {
						res.end("sent");
					}
				});
				console.log(loginStringJSON);
				dbService.insert({
					_id : Email,
					_rev : loginStringJSON._rev,
					fullName : loginStringJSON.fullName,
					password : randomPassword,
					PhoneNumber : loginStringJSON.PhoneNumber,
					address : loginStringJSON.address,
					ServiceType : loginStringJSON.ServiceType,
					city : loginStringJSON.city,
					Pincode : loginStringJSON.Pincode,
				}, function(err, data) {
					console.log(err);
				});

				res.send("<p>New Password has been sent to your mail!</p>");
			});
		} else {
			dbUser.get(Email, function(err, data) {
				var loginJson = JSON.stringify(data);
				var loginStringJSON = JSON.parse(loginJson);

				// sending random password to mail here
				var mailOptions = {
					from : "goservice.org@gmail.com",
					to : Email,
					subject : "Re: Password Forgotten Request from goservice",
					text : "Your new Password is : " + randomPassword
				};
				console.log(mailOptions);
				smtpTransport.sendMail(mailOptions, function(error, response) {
					if (error) {
						console.log(error);
						res.end("error");
					} else {
						res.end("sent");
					}
				});
				console.log(loginStringJSON);
				dbUser.insert({
					_id : Email,
					_rev : loginStringJSON._rev,
					fullName : loginStringJSON.fullName,
					password : randomPassword,
					PhoneNumber : loginStringJSON.PhoneNumber,
					address : loginStringJSON.address,
					// ServiceType : loginStringJSON.ServiceType,
					city : loginStringJSON.city,
					Pincode : loginStringJSON.Pincode,
				}, function(err, data) {
					console.log(err);
				});

				res.send("<p>New Password has been sent to your mail!</p>");
			});

		}
	});
});

/* reset password */
app.post('/resetpassword', function(req, res) {

	var doc = req.body.Email;
	var oldpword = req.body.OldPassword;
	var newpword = req.body.NewPassword;
	console.log(doc);
	console.log(newpword);
	var dbUser = cloudant.db.use('userregister');
	var dbService = cloudant.db.use('servicereg');
	dbService.get(doc, function(err, data1) {
		if (isEmpty(data1)) {
			dbUser.get(doc, function(err, data) {
				if (isEmpty(data)) {
					res.send("wrongUserName");
				} else {
					var loginJson = JSON.stringify(data);
					var loginStringJSON = JSON.parse(loginJson);
					if (oldpword == loginStringJSON.password) {
						console.log(loginStringJSON);
						dbUser.insert({
							_id : doc,
							_rev : loginStringJSON._rev,
							fullName : loginStringJSON.fullName,
							password : newpword,
							PhoneNumber : loginStringJSON.PhoneNumber,
							addr : loginStringJSON.addr,
							city : loginStringJSON.city,
							Pincode : loginStringJSON.Pincode,
						}, function(err, data) {
							console.log(err);
						});

						res.send("<p>New Password has been generated</p>");
					} else {
						res.send("<p>wrong password</p>");
					}

					if (err) {
						return err;
					}
				}

			});
		}
		// res.send(data)

		else {
			var loginJson = JSON.stringify(data1);
			var loginStringJSON = JSON.parse(loginJson);
			if (oldpword == loginStringJSON.password) {
				console.log(loginStringJSON);
				dbService.insert({
					_id : doc,
					_rev : loginStringJSON._rev,
					fullName : loginStringJSON.fullName,
					password : newpword,
					PhoneNumber : loginStringJSON.PhoneNumber,
					address : loginStringJSON.address,
					ServiceType : loginStringJSON.ServiceType,
					city : loginStringJSON.city,
					Pincode : loginStringJSON.Pincode,
				}, function(err, data1) {
					console.log(err);
				});

				res.send("<p>New Password has been generated</p>");
				
			} else {
				res.send("<p>wrong password</p>");
			}

			if (err) {
				return err;
			}
		}
		// res.send(data)

	});

});

app.get('/register', function(req, res) {
	res.sendFile(__dirname + '/public/' + 'index.html');
})
app.post('/register', function(req, res) {
	var FullName = req.body.myName;
	var Email = req.body.email;
	var Password = req.body.psw;
	// var ConfirmPassword = req.body.cpsw;
	var Address = req.body.address;
	var City = req.body.city;
	var PINcode = req.body.pin;
	var PhoneNumber = req.body.phone;
	var docId = req.body.email;
	var dbUser = cloudant.db.use('userregister');
	dbUser.insert({
		"_id" : docId,
		"fullName" : FullName,
		"email" : Email,
		"password" : Password,
		// " confirmPassword" : ConfirmPassword,
		"addr" : Address,
		"city" : City,
		"Pincode" : PINcode,
		"PhoneNumber" : PhoneNumber
	}, function(err, data) {
		if (err) {
			return err
		}
		// console.log(data);
		// res.send("Registered Successfull");
		res.redirect("loginPage.html");
		// alert();
	});
})
app.get('/register', function(req, res) {
	res.sendFile(__dirname + '/public/' + 'index.html');
})
app.post('/serregister', function(req, res) {
	var FullName = req.body.myName;
	var Email = req.body.email;
	var Password = req.body.psw;
	// var ConfirmPassword = req.body.cpsw;
	var ServiceType = req.body.servicetype;
	var Address = req.body.address;
	var City = req.body.city;
	var PINcode = req.body.pin;
	var PhoneNumber = req.body.phone;
	var docId = req.body.email;
	var dbService = cloudant.db.use('servicereg');
	dbService.insert({
		_id : docId,
		"fullName" : FullName,
		"email" : Email,
		"password" : Password,
		// " confirmPassword" : ConfirmPassword,
		"ServiceType" : ServiceType,
		"address" : Address,
		"city" : City,
		"Pincode" : PINcode,
		"PhoneNumber" : PhoneNumber
	}, function(err, data) {
		if (err) {
			return err
		}
		// console.log(data);
		// res.send("Registered Successfull");
		res.redirect("loginPage.html");
	});
});

app.post('/getServiceManDetails', function(req, res){
	var dbService = cloudant.db.use('servicereg');
	dbService.get(req.body.serviceMailAddr, function(err, data) {
		res.send(data);
	});
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
});
