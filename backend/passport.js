/* 
    config for OAuth
        Passport.js: session management (NOT auth)
        GoogleStrat: authentication/authorization
*/
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Google OAuth


// attach authenticated_user to session: req.session.passport.user -> req.session.passport.user.auth_user_obj
/* passport.serializeUser(function (user, done) {
    done(null, user);
}); */

// take authenticated_user from req.session.passport.user.auth_user_obj -> req.user.auth_user_obj
// used by passport.session (DB should be used)
/* passport.deserializeUser(function (user, done) {
    done(null, user);
}); */

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
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName
    };
    // Store user in mongo
    
    return done(null, profile);
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