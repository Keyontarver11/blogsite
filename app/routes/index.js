module.exports = function(app, passport) {
  require("./auth")(app, passport, isLoggedIn);
  require("./views")(app, isLoggedIn);
};

function isLoggedIn(req,res, next){
  if (req.isAuthenticated())
  return next();

  res.redirect('/');
}