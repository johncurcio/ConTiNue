var story_controller = require('../controllers/story_controller');
var user_controller = require('../controllers/user_controller');
var vote_controller = require('../controllers/vote_controller');

module.exports = function(app, passport) {  
  // all pages need a title!
  app.get('/', function(req, res){
    res.redirect('/storypage/1');
  });
  
  app.get('/storypage/:page', story_controller.story_list);

  app.get('/story/:id', story_controller.story_fragments_list);

  app.post('/story/:id/upvote', vote_controller.upvote);

  app.get('/story/:id/upvote', vote_controller.votes);

  app.get('/login', user_controller.user_login_get);

  app.post('/login', passport.authenticate('local-login', {
      successReturnToOrRedirect : '/', 
      failureRedirect : '/login', 
      failureFlash : true
  }));

  app.get('/signup', user_controller.user_signup_get);

  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/', 
      failureRedirect : '/signup', 
      failureFlash : true // allow flash messages
  }));

  app.get('/logout', user_controller.user_logout_get);

  app.get('/addStory', isLoggedIn, story_controller.story_create_get);

  app.post('/addStory', isLoggedIn, story_controller.story_create_post );

  app.post('/story/:id/addFragment', isLoggedIn, story_controller.story_fragment_create_post );

  app.post('/story/:id/compiledStory', story_controller.story_fragment_compile_post );

  app.get('/story/:id/compiledStory', story_controller.story_fragment_compile_post );

  app.get('/profile/:user', story_controller.story_and_fragments_by_author );

  app.get('/story/:id/dashboard', isLoggedIn, story_controller.dashboard_get );

  app.post('/story/:id/dashboard/updateFragment/:fragmentId', isLoggedIn, story_controller.fragment_update_post );

  app.get('/story/:id/dashboard/deleteFragment/:fragmentId', isLoggedIn, story_controller.fragment_delete_get );

  app.post('/story/:id/dashboard/updateStory', isLoggedIn, story_controller.story_update_post );

  app.post('/story/:id/dashboard/deleteStory', isLoggedIn, story_controller.story_delete_post );

  app.post('/story/:id/dashboard/closeStory', isLoggedIn, story_controller.story_close_post );

  app.post('/story/:id/dashboard/openStory', isLoggedIn, story_controller.story_open_post );

  app.post('/story/:id/dashboard/mergeFragments', isLoggedIn, story_controller.fragments_merge_post);

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.session.returnTo = req.url; 
    res.redirect('/login');
}

