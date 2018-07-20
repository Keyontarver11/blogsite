module.exports = function(app,isLoggedIn) {

    app.get("/", function(req, res) {
        if (req.isAuthenticated()){
            res.render('/home');
        }
        else{
            res.redirect("/signin");
        }
    });

    app.get("/home", isLoggedIn, function(req, res) {
        res.render("home.ejs",{
          user: req.user
        });
    });

    app.get("/password-recovery", function(req, res) {
        res.render("password-recovery.ejs",{
            message: req.flash('passwordRecoveryMessage')
        });
    });

    app.get("/password-reset", function(req, res) {
        res.render("password-reset.ejs",{
            message: req.flash('passwordResetMessage'),
            
        });
    });

    app.get("/profile",isLoggedIn, function(req, res) {
        res.render("profile.ejs",{
            user: req.user
        });
    });

    app.get("/signin", function(req, res) {
        res.render("signin.ejs",{ 
            message: req.flash('sign-in-msg')}
        );
    });

    app.get("/signup", function(req, res) {
        res.render("signup.ejs",{ 
            message: req.flash('sign-up-msg')}
        );
    });

    app.get("/update-profile", isLoggedIn, function(req, res) {
        res.render("update-profile.ejs",{
            message: req.flash('update-profile-msg'),
            user: req.user
        });
    });
    
    app.get("*", function(req, res) {
        res.render("404.ejs");
    });
};
