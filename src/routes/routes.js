var story_controller = require('../controllers/story_controller');

module.exports = function(app, passport) {
  // all pages need a title!
  app.get('/',  function(req, res){
    res.redirect('/1');
  });
  app.get('/:page',  story_controller.story_list);

  app.get('/story/:id', story_controller.story_fragments_list);

  app.get('/login', function(req, res) {
      res.render('login', { 
        title: 'Entrar | ConTiNue', 
        message: req.flash('loginMessage'), 
        loggedUser: req.user 
      }); 
  });

  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/', 
      failureRedirect : '/login', 
      failureFlash : true
  }));

  app.get('/signup', function(req, res) {
      res.render('signup', { 
        title: 'Registre-se | ConTiNue', 
        message: req.flash('signupMessage'), 
        loggedUser: req.user 
      });
  });

  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/', 
      failureRedirect : '/signup', 
      failureFlash : true // allow flash messages
  }));

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/addStory', isLoggedIn, story_controller.story_create_get);

  app.post('/addStory', story_controller.story_create_post );

  app.post('/story/:id/addFragment', story_controller.story_fragment_create_post );

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}


