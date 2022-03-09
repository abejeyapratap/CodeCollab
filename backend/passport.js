/* 
    config for OAuth
        Passport.js: session management (NOT auth)
        GoogleStrat: authentication/authorization
*/
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google OAuth
const mongoose = require("mongoose");
const User = require("./models/auth");

/**
 * CB Fn called once Google authorizes; defines steps to authenticate user; returns authenticated user
 *
 * "verify" fn -> determine the user to which the Google acct belongs
 * (DB stuff goes here) - if user DNE, create one; otherwise, find user in DB
 * accessToken/refreshToken only if accessing other Google APIs
 * done() returns the Google profile of authorized user to serializeUser()
 * with DB, we can do other stuff (i.e, return user instead of profile, handle errs, etc.)
 */
const authUser = function (accessToken, refreshToken, profile, done) {
    // Check if user exists in DB; if so, return the user; if not, create & return
    try {
        User.findOne({ googleId: profile.id }).then((userDocument) => {
            if (userDocument) {
                console.log("User exists");
                /* console.log(userDocument._id);
                console.log(userDocument); */
                done(null, userDocument);
            } else {
                const newUser = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    profilePic: profile.photos[0].value,
                    displayName: profile.displayName,
                });

                newUser
                    .save()
                    .then((result) => {
                        console.log("User created");
                        // console.log(result);
                        done(null, newUser);
                    })
                    .catch((err) => {
                        console.log("User creation failed");
                    });
            }
        });
    } catch (err) {
        console.log("An error occurred", err);
    }

    // return done(null, profile);
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/api/auth/google/callback", // redirected URL
        },
        authUser
    )
);
