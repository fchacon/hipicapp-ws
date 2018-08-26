"use strict";

import UserController from "../controller/user-controller";
import * as Auth from '../../../auth/auth.service';

module.exports = class UserRoutes {
    static init(router) {
        router
        .route("/api/users")
        .get(Auth.isAuthenticated(), UserController.getAll)
        .post(UserController.createUser);

        router
        .route("/api/users/:_id")
        .post(Auth.isAuthenticated(), UserController.updateUser);
    }
}
