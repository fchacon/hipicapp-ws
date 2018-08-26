"use strict";

import mongoose from "mongoose";
import Promise from "bluebird";
import userSchema from "../model/user-model";
import _ from "lodash";

/* statics para autenticar */

userSchema.statics.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        let _query = {
            email: email
        };

        User.findOne(_query)
        .exec((err, users) => {
            err ? reject(err) : resolve(users);
        });
    });
};

/* fin statics para autenticar */
userSchema.statics.getAll = () => {
    return new Promise((resolve, reject) => {
        let _query = {};

        User.find(_query)
            .exec((err, users) => {
              err ? reject(err)
                  : resolve(users);
            });
    });
};

userSchema.statics.getById = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
          return reject(new TypeError("Id is not defined."));
        }

        User.findById(id)
        .lean()
        .exec((err, user) => {
            err ? reject(err)
                : resolve(user);
        });
    });
}

userSchema.statics.createUser = (user) => {
    return new Promise((resolve, reject) => {
      if (!_.isObject(user)) {
          return reject(new TypeError("User is not a valid object."));
      }

      let _user = new User(user);

      _user.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
}

userSchema.statics.updateUser = (userId, object) => {
    return new Promise((resolve, reject) => {
        /* check if the param object is a valid object */
        if (!_.isObject(object)) {
            return reject(new TypeError("User is not a valid object."));
        }

        return User.findByIdAndUpdate(userId, object, { new: true })
        .exec((err, newUser) => {
            err ? reject(err) : resolve(newUser);
        });
    });
}

userSchema.statics.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        if (!_.isString(id)) {
            return reject(new TypeError("Id is not a valid string."));
        }

        User.findByIdAndRemove(id)
            .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
            });
    });
}

const User = mongoose.model("User", userSchema);
module.exports = User;
