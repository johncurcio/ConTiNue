var express  = require('express');
var app      = express();
var path     = require('path');
var fs       = require('fs');

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

var stories;
fs.readFile('stories.json', 'utf8', function (err, data) {
  if (err) throw err;
  stories = JSON.parse(data);
});

app.get('/', (req, res) => {
  res.render('index', 
  		{ stories: stories }
  	)
});

app.get('/story/:id', (req, res) => {
  const story = stories.filter((stry) => {
    return stry.id == req.params.id
  })[0]

  res.render('story', {
    author: story.author,
    title: story.title,
    genre: story.genre,
	createdat: story.createdat,
	fragments: story.fragments
  })
});

app.listen(8080);

console.log('listening on port 8080');