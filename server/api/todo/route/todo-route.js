"use strict";

const TodoController = require("../controller/todo-controller");
const TodoMiddleware = require("../middleware/todo-middleware");

class TodoRoutes {
    static init(router) {
      router
        .route("/api/todos")
        .get(TodoMiddleware.checkParams, TodoController.getAll)
        .post(TodoController.createTodo);

      router
        .route("/api/todos/:id")
        .delete(TodoController.deleteTodo);
    }
}

module.exports = TodoRoutes;