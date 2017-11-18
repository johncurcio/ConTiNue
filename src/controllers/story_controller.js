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
    var id = mongoose.Types.ObjectId(req.params.id); 
    Story.findById(id)
    //.populate('fragments')
    .sort([['createdat', 'ascending']])
    .exec(function (err, story) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('story', { 
            author: story.author,
            synopsis: story.synopsis,
            title: story.title,
            genre: story.genre,
            createdat: story.createdat,
            fragments: story.fragments,  
            loggedUser: req.user
        });
    });
};