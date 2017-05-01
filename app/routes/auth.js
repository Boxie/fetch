var pug = require('pug');
var auth = require('../controller/auth');

module.exports = function(router, passport) {
    'use strict';
    // This will handle the url calls for /auth/ROUTE

    router.route('/login')
        .get(function(req, res, next) {
            if(req.isAuthenticated()) {
                console.log(req.user);
                res.send("Hello " + req.user.first_name + " " + req.user.last_name);
            } else {
                res.render("login", {"authstate":req.isAuthenticated()});
            }
        })
        .post(function(req, res, next) {
        // The local login strategy
            passport.authenticate('local', function(err, user) {
                if (err) {
                    res.redirect("/auth/login");
                    //console.log("error 1");
                    return next(err);
                }

                // Technically, the user should exist at this point, but if not, check
                if(!user) {
                    res.redirect("/auth/login");
                    //console.log("error 2");
                    return next();
                }

                // Log the user in!
                req.logIn(user, function(err) {
                    if (err) {
                        //console.log("error 3");
                        res.redirect("/auth/login");
                        return next(err);
                    }
                    console.log(user.username + ' just logged in ' + req.isAuthenticated());
                    req.session.user_id = req.user._id;

                    res.redirect('/profile') ;
                });

            })(req, res, next);
        });

    // route /logout
    router.route('/logout')
        .get(function(req, res, next) {
            if(req.isAuthenticated()) {
                req.logout(req);
                res.redirect("/auth/login");
            } else {
                res.redirect("/auth/login");
            }
        })
        .post(function(req, res, next) {
            // The local login strategy
            logout(req);
        });

    router.route('/register')
        .get(function(req, res, next) {
            res.render("register", {
                "authstate": req.isAuthenticated(),
            });
        })
        .post(function(req, res, next){
            //checks for existing usernames and email adresses
            auth.register(req.body, function (err, doc){
                if(!err){
                    res.redirect("/auth/login");
                } else {
                    res.send(err);
                }
            });
        });
};

function logout(req){

}