var mongoose = require('mongoose');
var Story    = require('../models/story')
var Fragment = require('../models/fragment')

// Display list of all Stories
exports.story_list = function(req, res, next) {
    Story.find()
    .sort([['genre', 'ascending']])
    .exec(function (err, list_stories) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('index', { 
            title: 'ConTiNue', 
            stories: list_stories, 
            loggedUser: req.user
        });
    });
};

exports.fragments_list = function(req, res, next) {
    console.log(req.params.id);
    var id = mongoose.Types.ObjectId(req.params.id); 
    Story.findById(id)
    //.populate('fragments')
    .sort([['createdat', 'ascending']])
    .exec(function (err, story) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('story', { 
            author: story.author,
            title: story.title,
            genre: story.genre,
            createdat: story.createdat,
            fragments: story.fragments,  
            loggedUser: req.user
        });
    });
};

/*var User     = require('../models/user');
var Fragment = require('../models/fragment')
var mongoose = require('mongoose');

var author = new User({
  _id: new mongoose.Types.ObjectId(),
  local: {
    username: 'username1',
    password: 'everywoman'
    }
});

author.save(function (err) {
  if (err) return handleError(err);
    
  var fragment1 = new Fragment({
        data: 'Chapeuzinho vermelho era uma garotinha muito levada...',
        author: author._id    // assign the _id from the person
      });

    fragment1.save(function (err) {
        if (err) return handleError(err);
    })

    var fragment2 = new Fragment({
        data: 'E, por isso, acabou sendo levada pelo lobo mau.',
        author: author._id    // assign the _id from the person
      });

    fragment2.save(function (err) {
        if (err) return handleError(err);

    })
  
  var story1 = new Story({
    genre     : 'fantasia',
    synopsis  : 'História da chapeuzinho vermelho',
    title: 'Chapeuzinho Vermelho',
    author: author._id,   // assign the _id from the person
    fragments: [fragment1, fragment2]
  });

  story1.save(function (err) {
    if (err) return handleError(err);


  });
});*/