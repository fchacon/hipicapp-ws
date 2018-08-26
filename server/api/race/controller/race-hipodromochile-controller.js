"use strict";

import mongoose from "mongoose";
import raceSchema from "../model/race-model";
import raceDateSchema from "../model/race-date-model";

const _ = require("lodash");
const RaceDAO = require("../dao/race-dao");
const RaceDatesDAO = require("../dao/race-dates-dao");
const cheerio = require('cheerio');
const rp = require('request-promise');
const iconv = require('iconv-lite');
const DateUtils = require("../../../utils/date_utils");
const Utils = require("../../../utils/utils");
const moment = require("moment");
const Race = mongoose.model('Race', raceSchema);
const RaceDate = mongoose.model('RaceDate', raceDateSchema);
const Excel = require('exceljs');

class RaceHipodromoChileController {

    static _scrapRace(raceId) {

        return new Promise((resolve, reject) => {
            let url = 'http://hipodromo.cl/hipodromochile/carreras-resultado-ver?id_carrera='+raceId;

            const options = {
                uri: url,
                transform: function(body) {
                    body = iconv.decode(body, 'iso88591');
                    return cheerio.load(body);
                },
                encoding: null
            };

            rp(options)
                .then(($) => {
                    let race_aux = {};

                    //Por ahora, sólo Hipódromo Chile
                    race_aux.racetrackId = 1;

                    //Video
                    const videoUrl = $("iframe").eq(0).attr("src").trim();
                    const lastSlashPositionVideoUrl = videoUrl.lastIndexOf("/");
                    const videoKey = videoUrl.substring(lastSlashPositionVideoUrl+1);
                    race_aux.videoUrl = "http://www.youtube.com/watch?v="+videoKey;

                    //Numero de carrera
                    race_aux.number = $("h3 strong").text();
                    race_aux.number = parseInt(race_aux.number.replace(/\D/g,''));

                    //Retrospecto
                    race_aux.id = $("h3 strong").siblings("small").text();
                    race_aux.id = parseInt(race_aux.id.replace(/\D/g,''));

                    //Distancia de la carrera
                    const distanceImgUrl = $("img.img-responsive.center-block").eq(1).attr("src").trim();
                    const lastIndexOfDistanceImgUrl = distanceImgUrl.lastIndexOf("/");
                    race_aux.distance = parseInt(distanceImgUrl.substring(lastIndexOfDistanceImgUrl+4, lastIndexOfDistanceImgUrl+8));

                    //Información principal
                    race_aux.info = $("h3 strong").parent().parent().html().trim();

                    //Información de premios
                    race_aux.prizes = $("h3 strong").parent("h3").parent("td").nextAll("td").eq(1).html().trim();

                    //Fecha de la carrera
                    const date = $("select#id_carrera").parent("form").parent("div").parent("div").nextAll("div.row").eq(0).children("div").eq(1).text().trim();
                    const dateParts = date.split(" ");
                    const year = parseInt(dateParts[5]);
                    let month = parseInt(DateUtils.getMonthNumber(dateParts[3].trim(), true));
                    if(month > 0 && month < 10)
                        month = "0"+month;

                    const day = parseInt(dateParts[1]);

                    race_aux.date = year+"/"+month+"/"+day;

                    let studShirtUrls = [];
                    $("iframe").eq(0).parent("div").parent("div.row").next("div.row").find("img").each(function(index, img) {
                        let url = $(this).attr("src").trim();
                        studShirtUrls.push(url);
                    });

                    let time = $("table.table.table-hover.table-condensed").eq(1).parent().parent().parent("div.row").prev("div.well.well-sm.text-left").html().trim();
                    let timeParts = time.split(" ");
                    race_aux.time = timeParts[1].trim();

                    //Posiciones
                    let dividends = [];
                    let positions = [];
                    $("table.table.table-hover.table-condensed").eq(0).find("tbody tr.elturf_align_top").each(function(index, item) {
                        let position = {};
                        let i = 0;
                        position.position = $(this).children("td").eq(i++).text();
                        position.position = position.position.replace(/\D/g,'').trim();

                        if(position.position == "")
                            position.position = index + 1;
                        else
                            position.position = parseInt(position.position);

                        position.number = parseInt($(this).children("td").eq(i++).text());

                        position.horseName = $(this).children("td").eq(i++).children("a").eq(0).text().trim();

                        position.horseAge = $(this).children("td").eq(i++).text();
                        position.horseAge = parseInt(position.horseAge.replace(/\D/g,''));

                        let horseWeight = $(this).children("td").eq(i++).text();
                        if(!isNaN(horseWeight)) {
                            position.horseWeight = parseInt(horseWeight.replace(/\D/g,''));
                        }

                        position.distance = $(this).children("td").eq(i++).text().trim();

                        position.jockeyWeight = parseInt($(this).children("td").eq(i++).text());

                        position.jockeyName = $(this).children("td").eq(i++).text().trim();

                        position.trainerName = $(this).children("td").eq(i++).text().trim();

                        let dividend = $(this).children("td").eq(i++).text();
                        dividend = dividend.replace(",", ".");
                        position.dividend = parseFloat(dividend);

                        //Agregar dividendo al listado de dividendos.
                        //Esto servirá para poder ordenar por fvoritismo
                        dividends.push(position.dividend);

                        position.studShirtUrl = studShirtUrls[index];

                        positions.push(position);
                    });

                    //Ordenar los dividendos
                    dividends.sort(function(a, b) {return a - b});

                    //Recorrer las posiciones y asignar el favoritismo
                    _.forEach(positions, function(position, p_index) {
                        _.forEach(dividends, function(dividend, d_index) {
                            if(position.dividend == dividend) {
                                position.favoritism = d_index + 1; //0 index + 1
                                return false;
                            }
                        });
                    });

                    race_aux.positions = positions;

                    //Dividendos a ganador/segundo/tercero
                    race_aux.dividends = {};
                    race_aux.dividends.winners = [];
                    race_aux.dividends.seconds = [];
                    race_aux.dividends.thirds = [];
                    race_aux.dividends.exacts = [];
                    race_aux.dividends.quinielas = [];

                    //Encontrar las filas donde están los datos de dividendos a ganador, segundo y tercero
                    let tr = $("div.col-sm-offset-3.col-sm-6.col-sm-offset-3").eq(0).find("tbody").find("tr");

                    //A ganador
                    let winners = tr.eq(0).find("td").eq(1).text();

                    if(winners.trim() != "") {
                        winners = winners.split("-");
                        for(let i = 0; i < winners.length; i++) {
                            winners[i] = winners[i].trim().replace(",", ".");
                            race_aux.dividends.winners.push(parseFloat(winners[i]));
                        }
                    }

                    //A segundo
                    let seconds = [];
                    seconds[0] = tr.eq(0).find("td").eq(2).text();
                    seconds[1] = tr.eq(1).find("td").eq(2).text();

                    for(let i = 0; i < seconds.length; i++) {
                        if(seconds[i].trim() != "") {
                            seconds[i] = seconds[i].split("-");
                            for(let j = 0; j < seconds[i].length; j++) {
                                seconds[i][j] = seconds[i][j].trim().replace(",", ".");
                                race_aux.dividends.seconds.push(parseFloat(seconds[i][j]));
                            }
                        }
                    }

                    //A tercero
                    let thirds = [];
                    thirds[0] = tr.eq(0).find("td").eq(3).text();
                    thirds[1] = tr.eq(1).find("td").eq(3).text();
                    thirds[2] = tr.eq(2).find("td").eq(3).text();

                    for(let i = 0; i < thirds.length; i++) {
                        if(thirds[i].trim() != "") {
                            thirds[i] = thirds[i].split("-");
                            for(let j = 0; j < thirds[i].length; j++) {
                                thirds[i][j] = thirds[i][j].trim().replace(",", ".");
                                race_aux.dividends.thirds.push(parseFloat(thirds[i][j]));
                            }
                        }
                    }

                    //Encontrar la tabla donde están los resultados de la quinela y exacta
                    let table = $("div.col-sm-offset-3.col-sm-6.col-sm-offset-3").eq(1).find("table").eq(0);
                    //2/5 5/2 $2.430 $1.610
                    // Exacta
                    let exact_bet_row = table.find("tr").eq(2);
                    let exact_bet_value = exact_bet_row.find("td").eq(1).text();
                    exact_bet_value = _.replace(exact_bet_value, new RegExp('-', 'g'), '');
                    exact_bet_value = _.replace(exact_bet_value,  new RegExp('  ', 'g'), ' '); // 2 espacios lo reemplazo por sólo 1 espacio

                    if(race_aux.number == 12) {
                      console.log('exact_bet_value: ', exact_bet_value);
                    }

                    let exact_bet_value_items = _.split(exact_bet_value, ' ');
                    for(let i = 0; i < (exact_bet_value_items.length / 2); i++) {
                      let exact_item = {key: '', value: 0};
                      exact_item.key = exact_bet_value_items[i];
                      exact_item.value = exact_bet_value_items[(exact_bet_value_items.length / 2) + i];
                      exact_item.value = _.replace(exact_item.value, '$', '');
                      exact_item.value = _.replace(exact_item.value,  /\./g, '');
                      exact_item.value = parseInt(exact_item.value);
                      race_aux.dividends.exacts.push(exact_item);
                    }

                    // Quinela
                    let quiniela_bet_row = table.find("tr").eq(3);
                    let quiniela_bet_value = quiniela_bet_row.find("td").eq(1).text();
                    quiniela_bet_value = _.replace(quiniela_bet_value,  new RegExp('-', 'g'), '');
                    quiniela_bet_value = _.replace(quiniela_bet_value,  new RegExp('  ', 'g'), ' ');
                    let quiniela_bet_value_items = _.split(quiniela_bet_value, ' ');
                    for(let i = 0; i < (quiniela_bet_value_items.length / 2); i++) {
                      let quiniela_item = {key: '', value: 0};
                      quiniela_item.key = quiniela_bet_value_items[i];
                      quiniela_item.value = quiniela_bet_value_items[(quiniela_bet_value_items.length / 2) + i];
                      quiniela_item.value = _.replace(quiniela_item.value, '$', '');
                      quiniela_item.value = _.replace(quiniela_item.value,  /\./g, '');
                      quiniela_item.value = parseInt(quiniela_item.value);
                      race_aux.dividends.quinielas.push(quiniela_item);
                    }

                    let race = new Race(race_aux);

                    resolve(race);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    static scrapRace(req, res) {
        RaceController._scrapRace(req.params.id)
            .then(race => {
                res.status(200).json(race);
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({status: "NOK", message: error});
            });
    }

    static _getRacesIdsByDate(date) {
        return new Promise((resolve, reject) => {
            //Formatear la fecha a yyyy-mm-dd
            date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");

            let url = 'http://hipodromo.cl/hipodromochile/carreras-buscar-programas?id_pais_programa=&fecha_reunion='+date;

            const options = {
                uri: url,
                transform: function(body) {
                    body = iconv.decode(body, 'iso88591');
                    return cheerio.load(body);
                },
                encoding: null
            };

            rp(options)
                .then(($) => {
                    let ids = [];
                    $("table.table.table-hover.table-condensed").eq(0).find("tbody tr").each(function(index, item) {
                        let anchor =  $(this).children("td").last().children("a");
                        if(anchor.text().trim() === "Anulada")
                            return true;
                        let link = anchor.prop("href");
                        let questionMarkPosition = link.indexOf("?id_carrera=");
                        let id = parseInt(link.substring(questionMarkPosition + 12)); // 12 es el largo del string '?id_carrera='
                        ids.push(id);
                    });

                    resolve(ids);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    static getRacesIdsByDate(req, res) {
        let date = req.query.date; // Viene en formato dd-mm-yyyy

        RaceHipodromoChileController._getRacesIdsByDate(date)
            .then(ids => {
                res.status(200).json(ids);
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({status: "NOK", message: error});
            });
    }

    static _scrapRacesByDate(date, saveInMongo) {
        return new Promise((resolve, reject) => {
            //Obtener ids de carreras de la fecha
            RaceHipodromoChileController._getRacesIdsByDate(date)
                .then(ids => {
                    let racesScrapped = [];
                    let racesSaved = [];
                    ids.forEach(id => {

                        //Por cada id de carrera encontrado, obtener su info desde la página (scrap)
                        RaceHipodromoChileController._scrapRace(id)
                            .then(race => {
                                racesScrapped.push(race);

                                if(saveInMongo) {
                                    RaceDAO.saveRace(race)
                                        .then(raceSaved => {
                                            racesSaved.push(race);

                                            //Si ya se guardaron todas las carreras
                                            if(racesSaved.length == ids.length) {
                                                racesSaved = Utils.sortRaces(racesSaved);
                                                resolve(racesSaved);
                                            }
                                        })
                                        .catch(error => reject(error));
                                }
                                else {
                                    //Si no se desea guardar en mongo y ya se parseó la última carrera del listado
                                    //entonces se debe ordenar el listado de carreras y retornar este json
                                    if(racesScrapped.length == ids.length) {

                                        //Ordenar carreras por número
                                        racesScrapped = Utils.sortRaces(racesScrapped);
                                        resolve(racesScrapped);
                                    }
                                }
                            })
                            .catch(error => {
                                reject(error);
                            });
                    });
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    static scrapRacesByDate(req, res) {
        let saveInMongo = parseInt(req.query.save) == 1;
        let date = req.query.date;

        RaceHipodromoChileController._scrapRacesByDate(date, saveInMongo)
            .then(races => {
                res.status(200).json(races);
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({status: "NOK", message: error});
            });
    }

    static scrapRacesByYear(req, res) {
        let saveInMongo = parseInt(req.query.save) == 1;
        //let saveInMongo = false;
        let year = parseInt(req.query.year);
        //let year = 2018;

        //Obtener las fechas de las carreras del año
        const racetrackId = 1; //Hipodromo Chile
        const scrapped = false;
        RaceDatesDAO.getDatesByYear(racetrackId, year, scrapped)
            .then(raceDates => {
                let promises = [];
                raceDates.forEach((raceDate, index) => {
                    let date = moment(raceDate.date).format("DD-MM-YYYY");
                    promises.push(RaceHipodromoChileController._scrapRacesByDate(date, saveInMongo));
                });

                Promise.all(promises)
                    .then(results => {
                        //res.status(200).json({status: "OK", results: results});

                        if(saveInMongo) {

                            let promisesRaceDates = [];
                            raceDates.forEach((raceDate, index) => {
                                raceDate.scrapped = true;
                                promisesRaceDates.push(RaceDatesDAO.markAsScrapped(raceDate));
                            });

                            Promise.all(promisesRaceDates)
                                .then(results => {
                                    res.status(200).json({status: "OK"});
                                })
                                .catch(error => {
                                    console.log("Error marcando fecha con scrapped en true", error);
                                    res.status(400).json({status: "NOK", message: error});
                                });
                        }
                        else {
                            res.status(200).json({status: "OK"});
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(400).json({status: "NOK", message: error});
                    });
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({status: "NOK", message: error});
            });
    }

    static getExcel(req, res) {
        let date = req.body.date;
        let secondBet = req.body.secondBet;
        let secondBetValue = req.body.secondBetValue;

        //Formatear la fecha a yyyy-mm-dd
        date = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        RaceDAO.getByDate(date)
            .then(races => {

                let workbook = new Excel.Workbook();
                let sheet = workbook.addWorksheet(moment(date).format("ddd DD-MM-YYYY"));
                let header = ['Carrera', 'Primero', 'Segundo', 'Exacta', 'Quinela', 'Acertada',
                    'Ganador', 'Acertado', 'Segundo1', 'Segundo2', 'Acertado', 'Ganado/Perdido', '----', 'Monto Apuesta'
                ];

                sheet.addRow(header);

                let winOrLost = [];
                let dayTotal = 0;
                races.forEach((race, index) => {

                    let i = 0;
                    let rowValues = [];

                    //Numero de carrera
                    rowValues[i++] = race.number;

                    //Favoritismo del ganador
                    rowValues[i++] = race.positions[0].favoritism;

                    //Favoritismo del segundo
                    rowValues[i++] = race.positions[1].favoritism;

                    //Exacta
                    if(race.dividends.exacts.length > 0)
                      rowValues[i++] = race.dividends.exacts[0].value;
                    else
                      rowValues[i++] = 0;

                    //Quinela
                    if(race.dividends.quinielas.length > 0)
                      rowValues[i++] = race.dividends.quinielas[0].value;
                    else
                      rowValues[i++] = 0;

                    //Acertado
                    rowValues[i++] = 0;

                    //Ganador
                    rowValues[i++] = race.dividends.winners[0];

                    //Acertado
                    rowValues[i++] = 0;

                    //Segundo 1 y 2
                    if(race.dividends.seconds.length > 0) {
                      rowValues[i++] = race.dividends.seconds[0];
                      rowValues[i++] = race.dividends.seconds[1];
                    }
                    else {
                      rowValues[i++] = 0;
                      rowValues[i++] = 0;
                    }

                    //Acertado
                    let rightBet = 0;
                    if(secondBet == race.positions[0].favoritism) {
                        rowValues[i++] = 1;
                        rightBet = 1;
                    }
                    else if(secondBet == race.positions[1].favoritism) {
                        rowValues[i++] = 2;
                        rightBet = 2;
                    }
                    else
                        rowValues[i++] = 0;

                    //Acumulado
                    //Si hay apuesta a segundo en la carrera actual
                    if(race.dividends.seconds.length > 0) {
                        let this_dividend;
                        if(rightBet > 0)
                            this_dividend = race.dividends.seconds[rightBet - 1] - 1;
                        else
                            this_dividend = 1;

                        //Si es la primera carrera
                        if(index == 0) {
                            winOrLost[index] = {formula: 'N2*'+this_dividend, result: secondBetValue * this_dividend};

                            //Si no se acertó esta carrera, poner en negativo
                            if(rightBet == 0)
                                winOrLost[index] = {formula: '-N2*'+this_dividend, result: -(winOrLost[index].result)};
                        }
                        else {
                            //Si la carrera anterior se acertó, entonces volver a apostar el mínimo
                            if(winOrLost[index-1].result > 0) {
                                winOrLost[index] = {formula: 'N2*'+this_dividend, result: secondBetValue * this_dividend};

                                //Si no se acertó esta carrera, poner en negativo
                                if(rightBet == 0)
                                    winOrLost[index] = {formula: '-N2*'+this_dividend, result: -(winOrLost[index].result)};
                            }
                            //Si la carrera anterior no se acertó, multiplicar la apuesta al doble
                            else if(winOrLost[index-1].result < 0) {
                                winOrLost[index] = {formula: 'ABS(L'+(index+1)+')*2*'+this_dividend, result: Math.abs(winOrLost[index-1].result) * 2 * this_dividend};

                                //Si no se acertó esta carrera, poner en negativo
                                if(rightBet == 0)
                                    winOrLost[index] = {formula: '-ABS(L'+(index+1)+')*2*'+this_dividend, result: -(winOrLost[index].result)}; //-(winOrLost[index]);
                            }
                            //Si la carrera anterior quedó en 0 (no hubo apuesta a segundo o pagó 1 peso a segundo)
                            //Encontrar la última carrera en donde se haya ganado o perdido
                            else {
                                //Partir con 0
                                winOrLost[index] = {formula: '0', result: 0};

                                for(let i = index-1; i >= 0; i--) {
                                    if(winOrLost[i].result > 0) {
                                        winOrLost[index] = {formula: 'N2*'+this_dividend, result: secondBetValue * this_dividend};

                                        if(rightBet == 0)
                                            winOrLost[index] = {formula: '-N2*'+this_dividend, result: -1 * secondBetValue * this_dividend};
                                        break;
                                    }
                                    else if(winOrLost[i].result < 0) {
                                        winOrLost[index] = {formula: 'ABS(L'+(i+2)+')*2*'+this_dividend, result: Math.abs(winOrLost[i].result) * 2 * this_dividend};

                                        //Si no se acertó esta carrera, poner en negativo
                                        if(rightBet == 0)
                                            winOrLost[index] = {formula: '-ABS(L'+(i+2)+')*2*'+this_dividend, result: -(winOrLost[index].result)}; //-(winOrLost[index]);

                                        break;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        winOrLost[index] = {formula: '0', result: 0};
                    }

                    //Agregar el Ganado/Perdido en segundos
                    rowValues[i++] = winOrLost[index];
                    rowValues[i++] = '';
                    rowValues[i++] = '';

                    // Add a row by contiguous Array (assign to columns A, B & C)
                    sheet.addRow(rowValues);

                    dayTotal += winOrLost[index].result;
                });

                sheet.getCell('N2').value = secondBetValue;
                sheet.getCell('L'+(races.length+3)).value = {formula: 'SUMA(L2:L'+(races.length+2)+')', result: dayTotal};


                workbook.xlsx.writeFile("race"+date+".xlsx")
                    .then(function() {
                        // done
                    });

                res.status(200).json(races);
            })
            .catch(error => {
                console.log(error);
                res.status(400).json(error);
            });
    }
}

module.exports = RaceHipodromoChileController;
