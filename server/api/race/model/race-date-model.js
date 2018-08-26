"use strict";

const mongoose = require("mongoose");

const RaceDate = new mongoose.Schema({
    date: {type: Date, required: true}, //URL del video youtube de la carrera
    racetrackId: {type: Number, required: true}, //1: Hipodromo Chile, 2: Club Hipico de Santiago, 3: Sporting, 4: Club Hipico de Concepción
    scrapped: {type: Boolean, required: true, default: false},
    createdAt: {type: Date, default: Date.now, required: true} //Fecha en que se insertó el registro
});

module.exports = RaceDate;