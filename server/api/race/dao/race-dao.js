"use strict";

const _ = require("lodash");
let mongoose = require("mongoose");
const Promise = require("bluebird");
const raceSchema = require("../model/race-model");
const moment = require("moment");

raceSchema.statics.getAll = () => {
    return new Promise((resolve, reject) => {
        let _query = {};

        Race.find(_query)
            .exec((err, races) => {
                err ? reject(err)
                    : resolve(races);
            });
    });
};

raceSchema.statics.getById = (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            return reject(new TypeError("Id is not defined."));
        }

        Race.findById(id)
            .exec((err, race) => {
                err ? reject(err)
                    : resolve(race);
            });
    });
}

raceSchema.statics.getByDate = (date) => {
    //date viene en formato YYYY-MM-DD
    //Obtener día siguiente
    let date_moment = moment(date, "YYYY-MM-DD");
    let next_day_moment = moment(date, "YYYY-MM-DD").add(1, 'day');

    return new Promise((resolve, reject) => {

        Race
            .find({
                date: {
                    "$gte": new Date(date_moment.year(), date_moment.month(), date_moment.date()), 
                    "$lt": new Date(next_day_moment.year(), next_day_moment.month(), next_day_moment.date())
                }
            })
            .sort({number: 1})
            .exec((err, races) => {
                err ? reject(err) : resolve(races);
            });
    });
}

raceSchema.statics.saveRace = (race) => {
    return new Promise((resolve, reject) => {
        if (!_.isObject(race)) {
            return reject(new TypeError("Race is not a valid object."));
        }

        let _race = new Race(race);

        _race.save((err, saved) => {
            err ? reject(err) : resolve(saved);
        });
    });
}

raceSchema.statics.deleteRace = (id) => {
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

const Race = mongoose.model("Race", raceSchema);

module.exports = Race;