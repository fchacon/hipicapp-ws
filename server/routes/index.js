"use strict";

const TodoRoutes = require("../api/todo/route/todo-route");
const UserRoutes = require("../api/user/route/user-route");
const RaceRoutes = require("../api/race/route/race-route");
/*__#GULP:SET_ROUTE#__*/

class Routes {
  static init(app, router) {
    
    //Todo
    TodoRoutes.init(router);
    UserRoutes.init(router);
RaceRoutes.init(router);
/*__#GULP:INIT_ROUTE#__*/
    
    app.use("/", router);
    /* incluyo las rutas para authenticacion */
    app.use('/auth', require('../auth').default);
  }
};

module.exports = Routes;
