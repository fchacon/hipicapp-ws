/**
 * 
 */
'use strict';

const mongoose = require("mongoose");
const Promise = require("bluebird");

class MongoConf {
    static init(connectionUrl) {
        mongoose.Promise = Promise;
        mongoose.connect(connectionUrl, { useMongoClient: true });
        mongoose.connection.on("error", console.error.bind(console, "An error ocurred with the DB connection: "));
    }
};

module.exports = MongoConf;