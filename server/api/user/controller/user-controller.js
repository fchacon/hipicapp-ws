"use strict";

import UserDAO from "../dao/user-dao";
import _ from 'lodash';

module.exports = class UserController {
  static getAll(req, res) {
      UserDAO
        .getAll()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json(error));
  }

  static getById(req, res) {
      UserDAO
        .getById(req.params.id)
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json(error));
  }

  static createUser(req, res) {
      let _user = req.body;

      UserDAO
        .createUser(_user)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static updateUser(req, res) {
    let _user = req.body;
    let _userId = req.params._id;
    
    /* quito nodos del modelo que no se puedan modificar */
    _.unset(_user, '_id');

    UserDAO
      .updateUser(_userId,_user)
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).json(error));
  }

  static deleteUser(req, res) {
    let _id = req.params.id;

    UserDAO
      .deleteUser(_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }
}
