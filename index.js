const express = require('express');
const routes = require('./routes/index');
const path = require('path'); //Imports the path module
const bodyParser = require('body-parser') //Import for parsing forms

//Mysql stuff
const session = require('express-session');


const app = express();


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //False doesn't work
app.use(bodyParser.json());


//Error middleware
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
  
   

app.use('/', routes);
app.set('views', path.join(__dirname, 'views'));  //Tells the code that are views directory is to be used for rendering templates
app.set('view engine', 'hjs') //Sets up the view engine

let port = process.env.PORT || 5000;
app.listen(port);
console.log('Server running on port ' + port);