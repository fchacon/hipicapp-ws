"use strict";

import mongoose from "mongoose";
import raceDateSchema from "../model/race-date-model";

const cheerio = require('cheerio');
const rp = require('request-promise');
const iconv = require('iconv-lite');
const RaceDatesDAO = require("../dao/race-dates-dao");
const moment = require("moment");
const RaceDate = mongoose.model('RaceDate', raceDateSchema);

class RaceDatesHipodromoChileController {
    static scrapRaceDatesFromLast(req, res) {
        RaceDatesDAO.getLastDate(1)
            .then(raceDate => {
                res.status(200).json(raceDate);
            })
            .catch(error => {
                console.log(error);
                res.status(200).json({status: "NOK", message: error});
            });
    }

    static scrapRaceDates(req, res) {
        //let fromYear = parseInt(req.query.fromYear);
        let fromYear = 2004;
        //let fromYear = 2018;

        RaceDatesDAO.getLastDate(1)
            .then(raceDate => {
                let lastDateMoment;
                //Si se guardó fecha de carreras, obtener la última fecha parseada
                if(raceDate) {
                    lastDateMoment = moment(raceDate.date);
                    fromYear = lastDateMoment.year();
                }
                //De lo contrario, asumimos como última fecha el 31 de diciembre del año anterior a fromYear
                else
                    lastDateMoment = moment((fromYear-1)+"-12-31");

                let promises = [];
                let dates = [];
                for(let year = fromYear; year <= parseInt(moment().format("YYYY")); year++) {
                    promises.push(RaceDatesHipodromoChileController.getDatesByYear(year));
                }

                Promise.all(promises)
                    .then((results) => {
        
                        let raceDates = [];
                        results.forEach((result, index) => {
                            result.forEach((date) => {
                                let dateMoment = moment(date);
                                
                                //Si la fecha parseada es del mismo año que la última guardada en mongo
                                //y además es un día del año previo, quiere decir que la fecha ya está en mongo.
                                //No se debe guardar.
                                if(dateMoment.year() == lastDateMoment.year() && dateMoment.dayOfYear() <= lastDateMoment.dayOfYear()) {
                                    ;
                                }
                                else {

                                    let _raceDate = {};
                                    _raceDate.racetrackId = 1; //Hipodromo Chile
                                    _raceDate.date = date;
                                    let raceDate = new RaceDate(_raceDate);
            
                                    raceDates.push(raceDate);
                                }
                            });
                        });

                        if(raceDates.length == 0) {
                            res.status(200).json([]);
                        }
                        else {
                            raceDates.forEach((raceDate, index) => {
                                RaceDatesDAO.saveRaceDate(raceDate)
                                    .then((raceDateSaved) => {
                                        if(index == (raceDates.length-1))
                                            res.status(200).json(raceDates);
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        res.status(400).json({status: "NOK", message: error});
                                    });
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(400).json({status: "NOK", message: error});
                    });
            })
            .catch(error => {
                console.log(error);
                res.status(200).json({status: "NOK", message: error});
            });
    }

    static getDatesByYear(year) {
        return new Promise((resolve, reject) => {
            const url = "http://hipodromo.cl/hipodromochile/carreras-calendario-anual?fecha_reunion_ano=";

            let options = {
                uri: url+year,
                transform: function(body) {
                    body = iconv.decode(body, 'iso88591');
                    return cheerio.load(body);
                },
                encoding: null
            };
            
            let dates = [];
            rp(options).then(($) => {
                $("div.table-x-responsive td.cal_resultado a").each(function(index, item) {
                    let i = 0;
                    let link = $(this).attr("href");
                    let datePosition = link.indexOf("fecha_reunion=");
                    let rawDate = link.substring(datePosition + 14); // 12 es el largo del string 'fecha_reunion='
                    let date = moment(rawDate, "YYYY-M-D").toDate();
                    dates.push(date);
                });

                resolve(dates);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = RaceDatesHipodromoChileController;