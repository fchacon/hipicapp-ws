'use strict';

import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/dao/user-dao';
import ApiConfig from '../config';

var validateJwt = expressJwt({
    secret: ApiConfig.getEnv().session.secret
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
    var access_token = null;
    return compose()
        // Validate jwt
        .use(function (req, res, next) {
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
                access_token = req.query.access_token;
            }

            // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
            // if (req.query && typeof req.headers.authorization === 'undefined') {
            //     req.headers.authorization = 'Bearer ' + req.cookies.token;
            //     access_token = req.cookies.token;
            // }

            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function (req, res, next) {
            User.getById(req.user._id)
                .then(user => {
                    if (!user) {
                        return res.status(401).end();
                    }

                    /*aca se validaba el campo expireTokenDate para no dejarlo entrar, se quita esta logica*/
                    /*else if ( _.has(user, 'expireTokenDate') == true && moment().diff(user.expireTokenDate) > 0 ) {
        
                        return res.status(401).json({message: "your session has expired"});
                    } 
                    */

                    req.user = user;
                    req.user.access_token = access_token;
                    next();
                    return null;
                })
                .catch(err => next(err));
        })
        // response with the error, message, status and code with
        .use(function (err, req, res, next) {
            res.status(err.status).json({
                error: err.name,
                message: err.message,
                code: err.code
            });
        });;
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (ApiConfig.getEnv().userRoles.indexOf(req.user.role) >= ApiConfig.getEnv().userRoles.indexOf(roleRequired)) {
                return next();
            } else {
                return res.status(403).send('Forbidden');
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
    return jwt.sign({ _id: id, role }, ApiConfig.getEnv().session.secret, {
        expiresIn: 300
    });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
    if (!req.user) {
        return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
}

