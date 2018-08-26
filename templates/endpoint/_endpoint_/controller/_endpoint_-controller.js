"use strict";

const #endpoint#DAO = require("../dao/_endpoint_-dao");
const ApiConfig = require("./../../../config");

class #endpoint#Controller {
    static getAll(req, res) {

        #endpoint#DAO
            .getAll()
            .then(_endpoint_s => res.status(200).json(_endpoint_s))
            .catch(error => res.status(400).json(error));
    }

    static getById(req, res) {
        #endpoint#DAO
            .getById(req.params.id)
            .then(_endpoint_ => res.status(200).json(_endpoint_))
            .catch(error => res.status(400).json(error));
    }

    static create#endpoint#(req, res) {
        let __endpoint_ = req.body;

        #endpoint#DAO
            .create#endpoint#(__endpoint_)
            .then(_endpoint_ => res.status(201).json(_endpoint_))
            .catch(error => res.status(400).json(error));
    }

    static delete#endpoint#(req, res) {
        let _id = req.params.id;

        #endpoint#DAO
            .delete#endpoint#(_id)
            .then(() => res.status(200).end())
            .catch(error => res.status(400).json(error));
    }
}

module.exports = #endpoint#Controller;