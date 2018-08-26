/**
 * Development variables
 */

'use strict';

const vars = {
    NODE_ENV: 'development',
    PORT: 8081,
    DB_MONGO_DEFAULT_HOST: 'mongodb://localhost/hipicapp',
    DB_MONGO_DEFAULT_PORT: 27017,
    DB_MYSQL_DEFAULT_HOST: null,
    DB_MYSQL_DEFAULT_PORT: null,
    MEMCACHE_SESSION_HOST: '192.168.1.224',
    MEMCACHE_SESSION_PORT: 11211,
    MEMCACHE_DATA_HOST: '192.168.1.224',
    MEMCACHE_DATA_PORT: 11211
};

module.exports = vars;
