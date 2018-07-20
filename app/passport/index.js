//loading things fro the strategy
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");

module.exports = function(passport) {
  //passport strategies
  // used to serialize the user
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        if (email) email = email.toLowerCase();
        
        process.nextTick(function() {
          User.findOne(
            {
              email: email
            },
            function(err, user) {

              if (err) {
                console.log(err)
                return done(err)
              }

              else if (!user) {
                console.log('no user found')
                return done(
                  null,
                  false,
                  req.flash("sign-in-msg", "No user found.")
                );
              } else if (!user.isValidPassword(password)) {
                console.log('no valid password')
                return done(
                  null,
                  false,
                  req.flash("sign-in-msg", "Ooops wrong password.")
                );
              } else if (!user.isEmailConfirmed()) {
                console.log('email not confirmed')
                return done(
                  null,
                  false,
                  req.flash("sign-in-msg", "your email aint confirmed")
                );
              } else return done(null, user);
            }
          );
        });
      }
    )
  );

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        if (email) email = email.toLowerCase();

        process.nextTick(function() {
          if (!req.isAuthenticated()) {
            User.findOne(
              {
                email: email
              },
              function(err, user) {
                if (err) return done(err);
                if (user) {
                  return done(
                    null,
                    false,
                    req.flash("sign-up-msg", "That email is already taken")
                  );
                } else if (password !== req.body.password_confirmation) {
                  console.log('>>>>>>> passwords do not match');
                  
                  return done(
                    null,
                    false,
                    req.flash("sign-up-msg", "passwords do not match")
                  );
                } else {
                  console.log('>>>>>>> passwords do not matc');
                  let emailHash = crypto.randomBytes(20).toString("hex");

                  let newUser = new User();
                  newUser.email = email;
                  newUser.password = newUser.generateHash(password);
                  newUser.name = req.body.name;
                  newUser.isEmailConfirmed = false;
                  newUser.emailConfirmationToken = emailHash;

                  newUser.save(function(err) {
                    if (err) {
                      console.log('>>>>>>> passwords do not mat');
                      return done(err);
                    }

                    let smtpTransport = nodemailer.createTransport({
                      service: "gmail",
                      auth: {
                        user: "fviclass@gmail.com",
                        pass: "fviclass2017"
                      }
                    });

                    let mailOptions = {
                      to: email,
                      from: "Blog",
                      subject:
                        "Hi " +
                        newUser.name +
                        ", here is your email verification",
                      text:
                        "Please click in link below to confirm your email or copy and paste in your browser url bar \n\n http://" +
                        req.headers.host +
                        "/email-confirmation/" +
                        emailHash,
                      html: ` 
                        <p>
                          Please click in the link below to <br/>
                          <a href='http://${req.headers.host}/email-confirmation/${emailHash}'> 
                            confirm your email address
                          </a>
                        </p>`
                    };
  
                    smtpTransport.sendMail(mailOptions);
                    //Sets it to false to redirect the user to the login page.
                    return done(
                      null,
                      newUser,
                      req.flash(
                        "sign-in-msg",
                        "A verification email has been sent to " + email
                      )
                    );
                  });

                  
                }
              }
            );
          } else {
            return done(null, req.user);
          }
        });
      }
    )
  );

  // Local update strategy
  passport.use(
    "local-profile-update",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
      },
      function(req, email, password, done) {
        if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        // asynchronous
        process.nextTick(function() {
          // if the user is not already logged in:
          if (!req.user) {
            

            return done(
              null,
              false,
              req.flash(
                "update-profile-msg",
                "You must be logged in to update your profile information"
              )
            );
          }

          // if password is invalid, return message
          else if (!req.user.isValidPassword(password)) {
            return done(
              null,
              false,
              req.flash("update-profile-msg", "Oops! Wrong password")
            );
          } else {
            var user = req.user;
            if (
              req.body.new_password &&
              req.body.new_password_confirmation &&
              req.body.new_password === req.body.new_password_confirmation
            ) {
              user.password = user.generateHash(req.body.new_password);
            }

            

            user.save(function(err) {
              if (err) return done(err);

              return done(
                null,
                user,
                req.flash("update-profile-msg", "Profile updated successfully!")
              );
            });
          }
        });
      }
    )
  );
};
