/**
 * 
 */
'use strict';
const mongoConfig = require('./mongo.conf');
const mysqlConfig = require('./mysql.conf');
const sqlServerConfig = require('./sqlServer.conf');

class DSConfig {
    static initMongoDB(initParams) {
        mongoConfig.init(initParams);
    }

    static initMysql(initParams) {
        mysqlConfig.init();
    }

    static initSqlServer(initParams) {

    }
};

module.exports = DSConfig;