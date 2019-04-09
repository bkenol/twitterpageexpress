var express = require('express');
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var Twit = require('twit');
var auth = require('./config.js');
const request = require('request');
var nodemon = require('nodemon');

let consumer_key = auth.api_key;
let consumer_secret = auth.api_secret_key;
let access_token = auth.access_token;
let access_token_secret = auth.access_token_secret;
let twit_user = "";


//required if using body-parser
app.use(bodyParser.urlencoded({ extended: true }));

var T = new Twit({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})



app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index', {
    	m:"Enter a Twitter user's name!", 
    	name: "", 
    	new_post: "", 
    	profile_image: "",
    	description: "",
    	location: ""})	
});

app.post('/', function(req, res){
	twit_user = req.body.twit_user;

	T.get('users/lookup', { screen_name: twit_user}, function(err, data, response) {

		
		//console.log('body:', body);
		//res.send("body: " + body);

		//let user = JSON.parse(response);
		console.log(data);
		let twit_name = data[0].name;
		let new_post = data[0].status.text;
		let profile_image = data[0].profile_image_url;
		let message = `It's ${twit_name}`;
		let description = data[0].description;
		let location = `📍 ${data[0].location}`;

		   //res.send(message);
			
		res.render('index',{
			m: `This the Twitter page of @${twit_name}`,
			name: twit_name + ' ✓',
			new_post: new_post,
			profile_image: profile_image,
			description: description,
			location: location
		});
			
	})

})

app.listen(3000, function(){
    console.log('app is running on port 3000')
})