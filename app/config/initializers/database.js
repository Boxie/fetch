/**
 * Created by Lukas on 22.04.17.
 */

var logger = require('winston');
var config = require('config');
var dbConfig = config.get('foodlane.dbConfig');
var dbAddress = dbConfig.protocol + '://' + dbConfig.username + ':' + dbConfig.password + "@" + dbConfig.host + ':' + dbConfig.port;

var nano = require('nano')(dbAddress)

function createViews(db){
    db.insert(
        { "views":
            { "list_username":
                { "map":
                    function(doc) {
                        if(doc.type === "user") {
                            emit([doc.username], doc._id);
                        }
                    }
                },
                "list_email": {
                    "map":
                        function(doc) {
                            if(doc.type === "user") {
                                emit([doc.email], doc._id);
                            }
                        }
                },
                "username_password": {
                    "map":
                        function(doc) {
                            if(doc.type === "user") {
                                emit([doc.username,doc.password]);
                            }
                        }
                },
            }
        }, '_design/users'

    );
}

module.exports = function(cb) {
    'use strict';
    // Initialize the component here then call the callback
    // More logic

    logger.info("[DATABSE] Initialize Database");

    nano.db.list(function(err, body) {

        if(err){
            logger.error("[FATAL] Failed to connect to Database");
            return;
        }

        // body is an array
        if(!body.includes(dbConfig.database)){
            nano.db.create(dbConfig.database , function () {

                // on error while creating
                if(err){
                    logger.error('[DATABASE] Failed to create Database \"' + dbConfig.database +"\"");
                }

                // created Database successfully
                logger.info('[DATABASE] Created database \"' + dbConfig.database +"\" SUCCESSFULLY");

                // Generate sample Data

                if(dbConfig.sampleData){
                    require('./sampleData/dbSampleData')(cb);
                }

                createViews(nano.db.use(dbConfig.database));

            });
        }
    });

    logger.info('[DATABASE] Initialized Database SUCCESSFULLY')
    // Return the call back
    cb();
};