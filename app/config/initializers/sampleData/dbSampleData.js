/**
 * Created by Lukas on 22.04.17.
 */

var db = require('./../../../helpers/database');
var logger = require('winston');

var request = require('request');

module.exports = function(cb) {


    logger.info("[DATABSE] Filling database with sample data");

    var sampleUsers = require('./users.json');
    addUsers(sampleUsers, function (){
        logger.info("[DATABSE] Filled database with sample data SUCCESSFULLY");
    });

};

function addUsers(body, cb){

    body.forEach(function (data){
        var user = {
            "type": "user",
            "email": data.email,
            "username": data.username,
            "password": data.password,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "address": {
                "street": data.street,
                "number": data.number,
                "postcode": data.postcode,
                "city": data.city
            }
        };
        db.insert(user);

    });
    cb();
}