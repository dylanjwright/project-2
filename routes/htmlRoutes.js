var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    console.log("Got index route");
    if (req.isAuthenticated()) {
      var user = {
        id: req.session.passport.user,
        isLoggedIn: req.isAuthenticated()
      };
      console.log("Authenticated", user);
      res.render("index", user);
    } else {
      console.log("NOT Authenticated");
      res.render("index");
    }
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  app.get("/dashboard", isLoggedIn, function(req, res) {
    res.render("dashboard");
  });

  app.get("/register", function(req, res) {
    res.render("register");
  });

  app.get("/signin", function(req, res) {
    res.render("signin");
  });

  app.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
      console.log(err);
      res.redirect("/");
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next;
  }
  res.redirect("/register");
}
