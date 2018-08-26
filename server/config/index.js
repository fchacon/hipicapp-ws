/**
 * 
 */

'use strict';
const _ = require('lodash');
const envConfig = require('./environment');
const expressConfig = require('./express.conf');
const RouteConfig = require('./routes.conf');
const DSConfig = require('./datasources');
const i18nConfig = require('./i18n.conf');

class ApiConfig {

    /**
     * API initialization 
     */
    static init(application) {

        //Init Plugins 
        expressConfig.init(application);
        
        //Init Routes
        RouteConfig.init(application);

        //Init DB
        DSConfig.initMongoDB(this.getEnv().DB_MONGO_DEFAULT_HOST);
        //DSConfig.initMysql();
        //DSConfig.initSqlServer();

        //Init i18n
        i18nConfig.init(application);
    }

    /**
     * Returns Environment configuration
     */
    static getEnv() {
        return envConfig || {};
    }

    static getAllConstants() {
        const globalConst = require('./constants/global.const.json');
        const otherConst = {}; //Future const files

        return _.merge(
            globalConst,
            otherConst
        );
    }
};

module.exports = ApiConfig;
