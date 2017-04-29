/**
 * Created by Lukas on 27.04.17.
 */
var LocalStrategy = require('passport-local').Strategy;

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var User = require("../models/users");

var config = require("config");
var authConfig = config.get("foodlane.authConfig");

module.exports = function(app, passport) {


    // Initialize passport

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(require('express-session')({
        secret: authConfig.secret,
        resave: authConfig.resave,
        saveUninitialized: authConfig.saveUninitialized
    }));
    app.use(passport.initialize());
    app.use(passport.session());


    // This is how a user gets serialized
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        if(user) {
            done(null, user);
        }
    });

    // Lookup a user in our database
    var lookupUser = function (username, password, done) {
        User.checkCredentials(username, password, function (auth_user){
            if(auth_user){

                return done(null, auth_user);
            }
            return done(null, false, {error: 'Incorrect username or password.'});
        });
    };

    passport.use(new LocalStrategy({usernameField: 'username', session: true}, lookupUser));
}