var router   = require('express').Router()
var fs       = require('fs');

var stories;
fs.readFile('stories.json', 'utf8', function (err, data) {
  if (err) throw err;
  stories = JSON.parse(data);
});

// all pages need a title!
router.get('/', (req, res) => {
  res.render('index', 
        { title: 'ConTiNue', stories: stories }
    )
});

router.get('/story/:id', (req, res) => {
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

module.exports = router