"use strict";

const _ = require("lodash");
let mongoose = require("mongoose");
const Promise = require("bluebird");
const _endpoint_Schema = require("../model/_endpoint_-model");
const ApiConfig = require("./../../../config");

_endpoint_Schema.statics.getAll = () => {
    return new Promise((resolve, reject) => {
        let _query = {};

        #endpoint#.find(_query)
            .exec((err, _endpoint_s) => {
                err ? reject(err)
                    : resolve(_endpoint_s);
            });
    });
};

_endpoint_Schema.statics.getById = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            return reject(new TypeError("Id is not defined."));
        }

        #endpoint#.findById(id)
            .exec((err, _endpoint_) => {
                err ? reject(err)
                    : resolve(_endpoint_);
            });
    });
}

_endpoint_Schema.statics.create#endpoint# = (_endpoint_) => {
    return new Promise((resolve, reject) => {
        if (!_.isObject(_endpoint_)) {
            return reject(new TypeError("#endpoint# is not a valid object."));
        }

        let __endpoint_ = new #endpoint#(_endpoint_);

        __endpoint_.save((err, saved) => {
            err ? reject(err)
                : resolve(saved);
        });
    });
}

_endpoint_Schema.statics.delete#endpoint# = (id) => {
    return new Promise((resolve, reject) => {
        if (!_.isString(id)) {
            return reject(new TypeError("Id is not a valid string."));
        }

        Todo.findByIdAndRemove(id)
            .exec((err, deleted) => {
                err ? reject(err)
                    : resolve();
            });
    });
}

const #endpoint# = mongoose.model("#endpoint#", _endpoint_Schema);

module.exports = #endpoint#;