var omdb = require("../controllers/omdb.controller");

module.exports = function(app) {
  app.get("/", function(req, res) {
    // //old way was going to use a different page when signed in
    // if (req.isAuthenticated()) {
    //   var user = {
    //     id: req.session.passport.user,
    //     isLoggedIn: req.isAuthenticated()
    //   };
    //   console.log("Authenticated", user);
    //   res.render("index", user);
    // } else {
    //   console.log("NOT Authenticated");
    //   omdb.trending(function(data) {
    //     //console.log(data);
    //     if (data.results.length > 0) {
    //       data.hasResults = true;
    //     }
    //     res.render("index", data);
    //   });
    //   //res.render("index");
    // }
    var user = null;
    if (req.isAuthenticated()) {
      user = {
        id: req.session.passport.user,
        isLoggedIn: req.isAuthenticated()
      };
      console.log("Authenticated", user);
    } else {
      console.log("NOT Authenticated");
    }

    var results = {};
    if (user) {
      results.isLoggedIn = user.isLoggedIn;
    }
// trending
    omdb.trending(function (trendingData) {
      if (trendingData.results.length > 0) {
        trendingData.hasResults = true;
      };
      results.trending = trendingData;
// top rated
      omdb.topRated(function(topRatedData){
        if (topRatedData.results.length > 0) {
          topRatedData.hasResults = true;
      };
      results.topRated = topRatedData;
// now playing
      omdb.nowPlaying(function(nowPlayingData){
        if (nowPlayingData.results.length > 0) {
          nowPlayingData.hasResults = true;
      };
      results.nowPlaying = nowPlayingData;
// upcoming
      omdb.upcoming(function(upcomingData){
        if (upcomingData.results.length > 0) {
          upcomingData.hasResults = true;
        }
        results.upcoming = upcomingData;

        res.render("index", results);
      })
     
    });
  });

  app.get("/dashboard", redirectIfNotLoggedIn, function(req, res) {
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

  app.get("/movie/:id", function(req, res) {
    var movieDbId = req.params.id;

    omdb.movieById(movieDbId, function(data) {
      console.log(data);
      if (req.isAuthenticated()) {
        data.isLoggedIn = req.isAuthenticated();
      }
      res.render("movie", data);
    });
  });

  app.get("/wishList", function(req, res) {
    if (req.isAuthenticated()) {
      var user = {
        id: req.session.passport.user,
        isLoggedIn: req.isAuthenticated()
      };
      console.log("Authenticated", user);

      res.render("wishList", user); //wishlist will request data from /api/wishList
    } else {
      console.log("NOT Authenticated");
      res.redirect("/signin"); //could make it display a placeholder
    }
  });

  app.get("/watchedList", function(req, res) {
    if (req.isAuthenticated()) {
      var user = {
        id: req.session.passport.user,
        isLoggedIn: req.isAuthenticated()
      };
      console.log("Authenticated", user);

      res.render("watchedList", user); //watchedList will request data from /api/watchedList
    } else {
      console.log("NOT Authenticated");
      res.redirect("/signin"); //could make it display a placeholder
    }
  });

  app.get("/search/:title/:type?", function(req, res) {
    var title = req.params.title;
    //var type = req.params.type || "movie";

    //omdb.search(title, type, function(data) {
    omdb.searchMovie(title, function(data) {
      console.log(data);
      if (data.results.length > 0) {
        data.hasResults = true;
      }
      if (req.isAuthenticated()) {
        data.isLoggedIn = req.isAuthenticated();
      }
      res.render("search", data);
    });
  });

  app.get("*", function(req, res) {
    if (req.isAuthenticated()) {
      isLoggedIn = req.isAuthenticated();
      res.render("404", { isLoggedIn });
    } else {
      res.render("404");
    }
  });
});

function redirectIfNotLoggedIn(req, res, next) {
  console.log("is logged function");
  if (req.isAuthenticated()) {
    console.log("is authed | next");
    return next;
  } else {
    console.log("not authed | signin");
    res.redirect("/signin");
  }
}
