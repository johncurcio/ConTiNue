var fs       = require('fs');

var stories;
fs.readFile('stories.json', 'utf8', function (err, data) {
  if (err) throw err;
  stories = JSON.parse(data);
});

module.exports = function(app, passport) {
  // all pages need a title!
  app.get('/', (req, res) => {
    res.render('index', 
          { title: 'ConTiNue', stories: stories, loggedUser: req.user }
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
      fragments: story.fragments, 
      loggedUser: req.user 
    })
  });

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


