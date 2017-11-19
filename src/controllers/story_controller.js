var mongoose = require('mongoose');
var Story    = require('../models/story')
var Fragment = require('../models/fragment')
var sanitizeHtml = require('sanitize-html');

// Display list of all Stories
exports.story_list = function(req, res, next) {
    var perPage = 4 //change this to add more pages
    var page    = req.params.page || 1
    Story.find()
    .sort([['createdat', 'descending']])
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function (err, list_stories) {
        Story.count().exec(function (err, count) {
            if (err) { return next(err); }
            //Successful, so render
            req.session.returnTo = req.url;
            res.render('index', { 
                  title: 'ConTiNue', 
                  stories: list_stories, 
                  loggedUser: req.user,
                  current: page,
                  pages: Math.ceil(count / perPage)
              });
        });
      
    });
};

exports.story_fragments_list = function(req, res, next) {
    Story.findById(req.params.id)
    //.populate('fragments')
    .sort([['createdat', 'ascending']])
    .exec(function (err, story) {
      if (err) { return next(err); }
      //Successful, so render
      req.session.returnTo = req.url;
      res.render('story', { 
            id: story._id,
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


exports.story_create_get = function(req, res, next) {
    res.render('newstory', { 
        title: 'Crie sua história',  
        loggedUser: req.user
    });
};


exports.story_create_post = function(req, res, next) {
    var story = new Story({
        author: req.user,
        title: req.body.title,
        genre: req.body.genre,
        synopsis: req.body.synopsis,
        fragments: []
    });
    story.save(function (err) {
        if (err) { return next(err); }
        res.render('story', { 
            id: story._id,
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

exports.story_fragment_create_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    var fragment = new Fragment({
        author: req.user,
        data: sanitizeHtml(req.body.data,{
          allowedTags: [ 'p', 'blockquote',  'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 
                         'em', 'strike', 'code', 'hr', 'br', 'caption', 'pre', 'u' ],
          allowedAttributes: {
            'a': [ 'href', 'name', 'target' ]
          }
        })
    });

    Story.findByIdAndUpdate(id, {$push: { fragments: fragment }}, {safe: true, upsert: true},
        function(err, model) {
            console.log(err);
        });

    fragment.save(function (err) {
        if (err) { return next(err); }
        res.redirect('/story/' + req.params.id);
    });
};

exports.story_fragment_compile_post = function(req, res, next) {
    Story.findById(req.params.id).exec(function (err, story) {
      if (err) { return next(err); }
          var compiled_story = "";
          story.fragments.forEach(function(fragment) {
            compiled_story += fragment.data + " ";
          });
          res.render('compiledstory', {
              id: req.params.id,
              loggedUser: req.user,
              full_story: compiled_story,
              title: story.title,
              story: story
          });
    });
};