var story_controller = require('../controllers/story_controller');

var fs       = require('fs');

var stories;
fs.readFile('stories.json', 'utf8', function (err, data) {
  if (err) throw err;
  stories = JSON.parse(data);
});

module.exports = function(app, passport) {
  // all pages need a title!
  app.get('/',  story_controller.story_list);

  app.get('/story/:id', story_controller.fragments_list);

  app.get('/login', function(req, res) {
      res.render('login', { title: 'Entrar | ConTiNue', message: req.flash('loginMessage'), loggedUser: req.user }); 
  });

  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/', 
      failureRedirect : '/login', 
      failureFlash : true
  }));

  app.get('/signup', function(req, res) {
      res.render('signup', { title: 'Registre-se | ConTiNue', message: req.flash('signupMessage'), loggedUser: req.user });
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

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}


