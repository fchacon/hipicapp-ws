"use strict";

const _ = require("lodash");
let mongoose = require("mongoose");
const Promise = require("bluebird");
const raceDateSchema = require("../model/race-date-model");

raceDateSchema.statics.saveRaceDate = (raceDate) => {
    return new Promise((resolve, reject) => {
        if (!_.isObject(raceDate)) {
            return reject(new TypeError("RaceDate is not a valid object."));
        }

        let _raceDate = new RaceDate(raceDate);

        _raceDate.save((err, saved) => {
            err ? reject(err) : resolve(saved);
        });
    });
}

raceDateSchema.statics.markAsScrapped = (raceDate) => {
    return new Promise((resolve, reject) => {
        RaceDate
            .update({_id: raceDate._id}, {$set: {scrapped: true}})
            .exec((error, result) => {
                error ? reject(error) : resolve(result);
            });
    });
}

raceDateSchema.statics.getLastDate = (racetrackId) => {
    return new Promise((resolve, reject) => {
        RaceDate
            .findOne({racetrackId: racetrackId}).sort({date: -1})
            .exec((error, raceDate) => {
                error ? reject(error) : resolve(raceDate);
            });
    });
}

raceDateSchema.statics.getDatesByYear = (racetrackId, year, scrapped) => {
    return new Promise((resolve, reject) => {
        let query = {};
        query.racetrackId = racetrackId;
        query.date = {"$gte": new Date(year, 0, 1), "$lt": new Date(year+1, 0, 1)};

        if(scrapped != null)
            query.scrapped = scrapped;

        RaceDate
            .find(query).sort({date: -1})
            .exec((error, raceDate) => {
                error ? reject(error) : resolve(raceDate);
            });
    });
}

const RaceDate = mongoose.model("RaceDate", raceDateSchema);

module.exports = RaceDate;