/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var Cloudant = require('cloudant');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var me = 'raghupatruni175';
var password = '7416133133';
var cloudant = Cloudant({account:me, password:password});
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
/*app.get('/index',function(req,res){
	res.sendFile(__dirname+'/'+'index.html');
})
 app.post('/l',function(req,res){
	 var doc = req.body.value;
	 var db = cloudant.db.use('userregister');
	 db.get(doc,function(err,data)
	 {
		
		 
		 var val=JSON.stringify(data);
		 var i=JSON.parse(val);
		 
		 //console.log(i);
		 console.log(i._id,i._rev);
		 /*response={
			 FullName:i.FullName,
			 Password:i.Password,
			 ConfirmPassword:i.ConfirmPassword,
			 Address:i.Address,
			 City:i.City,
			 PINcode:i.PINcode,
			 PhoneNumber:i.PhoneNumber
		 }*/
	/*	 var data="FullNameName&nbsp&nbsp&nbsp&nbsp:&nbsp<input type=\"text\" id=\"FullName\" value=\""+i.FullName+"\"/>"+
		 "Password&nbsp:&nbsp<input type=\"text\" id=\"Password\" value=\""+i.Password+"\"/>"+
		 "ConfirmPassword&nbsp:&nbsp<input type=\"text\" id=\"ConfirmPassword\" value=\""+i.ConfirmPassword+"\"/>"+
		 "Address&nbsp:&nbsp<input type=\"text\" id=\"Address\" value=\""+i.Address+"\"/>"+
		 "City&nbsp:&nbsp<input type=\"text\" id=\"City\" value=\""+i.City+"\"/>"+
		 "PINcode&nbsp:&nbsp<input type=\"text\" id=\"PINcode\" value=\""+i.PINcode+"\"/>"+
		 "PhoneNumber&nbsp:&nbsp<input type=\"text\" id=\"PhoneNumber\" value=\""+i.PhoneNumber+"\"/>"
		 "<input type=\"hidden\" id=\"revNum\" value=\""+i._rev+"\"/>"+
		 "<input type=\"hidden\" id=\"docId\" value=\""+i._id+"\"/>"+
		 "<input type='button' name='update' id=\"update\" value='UPDATE'>";
		 //console.log(js);
		 
		 
		 if(err)
		 {
			 return err
		 }
		  //res.write(req.body.value);
		 // res.contentType('application/json');
//res.send(JSON.stringify(data,['name','add']));
res.send(data);
	
	 });
 })*/
 app.get('/register',function(req,res){
	res.sendFile(__dirname+'/public/'+'index.html');
})
app.post('/register',function(req,res){
	 var FullName = req.body.myName;
	 var Email=req.body.email;
	 var Password = req.body.psw;
     var ConfirmPassword = req.body.cpsw;
     var ServiceType = req.body.servicetype;
     var Address = req.body.address;
     var City = req.body.city;
     var PINcode = req.body.pin;
     var PhoneNumber = req.body.phone;
	 var docId = req.body.email;
	 var db = cloudant.db.use('servicereg');
	 db.insert({_id : docId, "fullName" : FullName,"email" : Email, "password" : Password, " confirmPassword" : ConfirmPassword,"ServiceType" : ServiceType,"address": Address, "city" : City, "Pincode" : PINcode, "PhoneNumber" : PhoneNumber},function(err,data){
		 if(err){
			 return err
		 }
		 //console.log(data);
	 //res.send("Registered Successfull");
		 res.redirect("index.html");
	 }); 
 }) 
 /*
 app.get('/index',function(req,res){
	res.sendFile(__dirname+'/'+'index.html');
})
 app.post('/update',function(req,res){
	 var v3 = req.body.name;
	 var v4 = req.body.addr;
	 var v5 = req.body.revNum;
	 var v6 = req.body.docId;
	 var db = cloudant.db.use('crud11');
	 db.insert({_id:v6,_rev:v5,"name":v3,"add":v4},function(err,data){
		 if(err){
			 return console.log(err);
		 }
		 console.log(data);
	 res.send("Update Successfull");
	 });	 
 });

app.post('/delete', function(req, res){
	var docId= req.body.docId;
	var db = cloudant.db.use('crud11');
	db.get(docId,function(err,data)
	 {
		 var value=JSON.stringify(data);
		 var k=JSON.parse(value);
		if(err)
		 {
			 return err
		 }
	var revNum = k._rev;
	console.log(revNum);
	db.destroy(docId, revNum, function(err, data){
		console.log("asdfg");
		console.log("error", err);
		console.log("data", data);
		res.send("Delete Successfull");
	});
	 })
})*/

//get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
// start server on the specified port and binding host
app.listen(8008); 
  // print a message when the server starts listening
  console.log("server starting on 8008");
