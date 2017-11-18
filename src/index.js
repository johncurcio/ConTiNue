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

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'groupstorytellingisamazing' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app, passport);

app.listen(port);

console.log('listening on port 8080');