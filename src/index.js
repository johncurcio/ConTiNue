var express  = require('express');
var app      = express();
var path     = require('path');
var fs       = require('fs');

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

var mainRoutes = require('./routes/main')
app.use(mainRoutes)

app.listen(8080);

console.log('listening on port 8080');