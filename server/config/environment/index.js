'use strict';

const _ = require('lodash');
const sharedVars = require('./shared');
const envVars = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined) ? require('./development') : process.env || {};

const vars = _.merge(
    sharedVars,
    envVars,
)

module.exports = vars;