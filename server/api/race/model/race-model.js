"use strict";

const mongoose = require("mongoose");

const Race = new mongoose.Schema({
    videoUrl: {type: String, required: false}, //URL del video youtube de la carrera
    number: {type: Number, required: true}, //Numero de la carrera
    id: {type: Number, required: true}, //Id de la carrera (entregado por la página)
    distance: {type: Number, required: true}, //Distancia de la carrera
    info: {type: String, required: false}, //Info relacionada con el horario, el estado de la pista, etc
    prizes: {type: String, required: false}, //Premios de la carrera
    date: {type: Date, required: true}, //Fecha (año/mes/dia) de la carrera
    time: {type: String, required: false}, //Tiempo que puso el caballo ganador
    positions: [{
        position: {type: Number, required: true}, //Posicion en que llegó el caballo en la carrera
        number: {type: Number, required: true}, //Numero de la chaquetilla
        horseName: {type: String, required: true}, //Nombre del caballo
        horseAge: {type: Number, required: false}, //Edad del caballo
        horseWeight: {type: Number, required: false}, //Peso del caballo
        distance: {type: String, required: false}, // A cuántos cuerpos llegó el caballo
        jockeyWeight: {type: Number, required: false}, //Peso del jinete
        jockeyName: {type: String, required: false}, //Nombre del jinete
        trainerName: {type: String, required: false}, //Nombre del preparador
        dividend: {type: Number, required: true}, //Dividendo del caballo
        favoritism: {type: Number, required: true},
        studShirtUrl: {type: String, required: false} //Url a la imagen de la casaquilla del stud
    }],
    dividends: {
        winners: [{type: Number, required: false}],
        seconds: [{type: Number, required: false}],
        thirds: [{type: Number, required: false}],
        exacts: [{key: {type: String, required: false}, value: {type: Number, required: false}}],
        quinielas: [{key: {type: String, required: false}, value: {type: Number, required: false}}],
    },
    racetrackId: {type: Number, required: true}, //1: Hipodromo Chile, 2: Club Hipico de Santiago, 3: Sporting, 4: Club Hipico de Concepción
    createdAt: {type: Date, default: Date.now, required: true} //Fecha en que se insertó el registro
});

module.exports = Race;
