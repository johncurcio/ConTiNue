
exports.user_login_get = function(req, res) {
  res.render('login', { 
    title: 'Entrar | ConTiNue', 
    message: req.flash('loginMessage'), 
    loggedUser: req.user 
  }); 
}


exports.user_signup_get = function(req, res) {
  res.render('signup', { 
    title: 'Registre-se | ConTiNue', 
    message: req.flash('signupMessage'), 
    loggedUser: req.user 
  });
}

exports.user_logout_get = function(req, res) {
  req.logout();
  res.redirect('/');
}