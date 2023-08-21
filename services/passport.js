const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  
  User.findById(id).then(user => {
    done(null,user);
  });
  
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      //Find the first ID that matches the profile id, it returns a promise
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          //record is already present in DB
          done(null, existingUser);
        } else {
          // no record exists so make the ID
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user));

          // console.log("profile: ", profile);
        }
      });
    }
  )
);
