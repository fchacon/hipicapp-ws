/**
 * Middleware
 */
'use strict';

const ApiConfig = require("./../../../config");

class #endpoint#Middleware {
    static checkParams(req, res, next) {
        //console.log('check params!', req.query);
        //console.log('check body!', req.body);

        /**
         *  PUT YOUR CODE HERE!
        */

        next();
    }
}

module.exports = #endpoint#Middleware;