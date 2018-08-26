"use strict";

const #endpoint#Controller = require("../controller/_endpoint_-controller");
const #endpoint#Middleware = require("../middleware/_endpoint_-middleware");

class #endpoint#Routes {
    static init(router) {
        router
            .route("/api/_endpoint_s")
            .get(#endpoint#Middleware.checkParams, #endpoint#Controller.getAll)
            .post(#endpoint#Controller.create#endpoint#);

        router
            .route("/api/_endpoint_s/:id")
            .delete(#endpoint#Controller.delete#endpoint#);
    }
}

module.exports = #endpoint#Routes;
