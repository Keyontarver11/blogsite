const express = require("express");
const app = express();
const port = process.env.PORT || 8899;
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const database = require("./database")();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./app/passport")(passport);

// setup ejs
app.set("view engine", "ejs");

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:"+port);

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//passport shit
app.set("trust proxy", 1);

app.use(
  session({
    secret: "johncena",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  })
);

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

app.use("/", express.static(__dirname + "/assets"));

require("./app/routes")(app, passport);

app.listen(port, function(err) {
  if (err) console.log("error ", err);

  console.log("Server listening on port " + port);
});
