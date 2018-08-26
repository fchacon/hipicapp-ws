"use strict";

import mongoose from "mongoose";
import crypto from 'crypto';
import _ from 'lodash';

/* timestamps: se agrega para que el modelo por defecto cree los nodos: createdAt: (fecha) y updatedAt: (fecha) */
const User = new mongoose.Schema({
    name: { type: String, required: false, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    provider: String,
    salt: String
}, { timestamps: true })


var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
User
.pre('save', function(next) {
    // Handle new/update passwords
    console.log('isModified', this.isModified('password'));
    if (!this.isModified('password')) {
        return next();
    }

    if (!validatePresenceOf(this.password)) {
        if (authTypes.indexOf(this.provider) === -1) {
            return next(new Error('Invalid password'));
        } else {
            return next();
        }
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
        if (saltErr) {
            return next(saltErr);
        }
        this.salt = salt;
        this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
            if (encryptErr) {
                return next(encryptErr);
            }
            this.password = hashedPassword;
            return next();
        });
    });
});

/*** Methods */

User.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    authenticate(password, callback) {
        if (!callback) {
            return this.password === this.encryptPassword(password);
        }

        this.encryptPassword(password, (err, pwdGen) => {
            if (err) {
                return callback(err);
            }

            if (this.password === pwdGen) {
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        });
    },

    /**
     * Make salt
     *
     * @param {Number} [byteSize] - Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt(byteSize, callback) {
        var defaultByteSize = 16;

        if (typeof arguments[0] === 'function') {
            callback = arguments[0];
            byteSize = defaultByteSize;
        } else if (typeof arguments[1] === 'function') {
            callback = arguments[1];
        } else {
            throw new Error('Missing Callback');
        }

        if (!byteSize) {
            byteSize = defaultByteSize;
        }

        return crypto.randomBytes(byteSize, (err, salt) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, salt.toString('base64'));
            }
        });
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword(password, callback) {
        if (!password || !this.salt) {
            if (!callback) {
                return null;
            } else {
                return callback('Missing password or salt');
            }
        }

        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');
        var digest = 'sha512';

        if (!callback) {
            return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, digest)
                .toString('base64');
        }    
        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, digest, (err, key) => {
            if (err) {
                return callback(err);
            } else {
                return callback(null, key.toString('base64'));
            }
        });
    }
};

module.exports = User;
