var express  = require('express');
var app      = express();
var path     = require('path');
var fs       = require('fs');
var port     = process.env.PORT || 8080;

var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var path         = require('path');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var compression = require('compression');
var helmet      = require('helmet');

var expressValidator = require('express-validator');

app.set('view engine', 'ejs');

app.use(compression()); //Compress all routes
app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

var options = { promiseLibrary: require('bluebird') };
var configDB = require('./config/database.js');
mongoose.connect(configDB.url, options); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); 

// required for passport
app.use(session({ secret: 'groupstorytellingisamazing' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app, passport);

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.render('404', { 
    title: 'Opa! Nada foi encontrado',  
    loggedUser: req.user 
  });
});

app.listen(port);

console.log('listening on port 8080');