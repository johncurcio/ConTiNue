var mongoose = require('mongoose');
var Story    = require('../models/story')
var Fragment = require('../models/fragment')
var Vote = require('../models/vote')
var sanitizeHtml = require('sanitize-html');

// Display list of all Stories
exports.story_list = function(req, res, next) {
    var perPage = 6 //change this to add more pages
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
        story_id: id, 
        data: sanitizeHtml(req.body.data,{
          allowedTags: [ 'p', 'blockquote',  'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 
                         'em', 'strike', 'code', 'hr', 'br', 'caption', 'pre', 'u', 'sub', 'sup',
                         'strike', 'span' ],
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


exports.story_and_fragments_by_author = function(req, res, next){
    Story.find({"author":req.params.user}).exec(function(err, stories){
      if (err) { return next(err); }
      Fragment.find({"author":req.params.user}).exec(function(errf, fragments){
        if (errf) { return next(errf); }
        res.render('profile', {
          loggedUser: req.user,
          title: 'Perfil' ,
          stories: stories,
          fragments: fragments 
        });
      });
    });
};

exports.dashboard_get = function(req, res) {
  Story.findById(req.params.id).exec(function (err, story) {
    if (err) { return next(err); }
        res.render('dashboard', {
            id: req.params.id,
            loggedUser: req.user,
            title: story.title,
            story: story
        });
  });
};

exports.fragment_update_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.fragmentId); 
    var data = sanitizeHtml(req.body.data,{
          allowedTags: [ 'p', 'blockquote',  'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 
                         'em', 'strike', 'code', 'hr', 'br', 'caption', 'pre', 'u', 'sub', 'sup',
                         'strike', 'span' ],
          allowedAttributes: {
            'a': [ 'href', 'name', 'target' ]
          }
        });

    Fragment.findByIdAndUpdate(id, { data: data, modifieddat: new Date() }, {safe: true, upsert: false},
        function(err, model) {
            if (err) { return next(err); }
            res.redirect('/story/' + req.params.id + '/dashboard');
        });
};

exports.fragment_delete_get = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.fragmentId); 
    Fragment.remove({ id: id }, function (err) {
      if (err) return handleError(err);
      Story.update({_id: req.params.id}, 
                   {$pull: {fragments: id}}, 
                    function (err, numberAffected) {
                      if (!err){
                        console.log(numberAffected);
                      } else {
                        console.log(err);                
                      }
        });
      Vote.remove({ fragment: id }, function (err) {
        if (err) return console.log(err);
      });
      res.redirect('/story/' + req.params.id + '/dashboard');
    });
};

exports.story_update_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    var title = req.body.title;
    var synopsis = req.body.synopsis;
    var genre = req.body.genre;
    console.log(title);

    Story.update({_id: req.params.id}, { $set: { title: title, synopsis: synopsis, genre: genre }},
        function(err, callback) {
            if (err) { return next(err); }
            res.redirect('/story/' + req.params.id + '/dashboard');
        });
};

exports.story_delete_post = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id); 
    Story.remove({ _id: id }, function (err) {
      if (err) return handleError(err);
      Fragment.find({ story_id: id }).exec(function(err, fragments){
        if (err) return handleError(err);
        fragments.forEach(function (fragment) {
          Vote.remove({fragment: fragment}, function(err){
            res.redirect('/profile/'+req.user._id);
          })
        })
      });
    });
};

