/**
 * Creacion de unit test para endpoints automatizado
 * 
 * Comandos:
 *   - npm run new-unitTest NOMRBE_ENDPOINT
 *   - gulp new-endpoint_unitTest --endpoint_unitTest NOMRBE_ENDPOINT
 * 
 * Importante:
 *   - El nombre del endpoint_unitTest debe ser singular y no puede comenzar con un numero
 *   - En la carpeta templates se debe definir esta definida la estructura de carpetas de los endpoint_unitTest
 */
'use strict';

var gulp = require('gulp');
var dogen = require('./custom_dogen.js');
var replace = require('gulp-replace');
var _ = require('lodash');
var pathExists = require('path-exists');
var argv = require('yargs').argv;


var placeholder = 'endpoint_unitTest';//este es el nombre del tag a reemplazar (nombre de directorios, clases, metodos, etc)
var destination = 'tests/server/';//ruta de destino donde se crean los endpoints
var fileGeneratorHelper = require('./helper.js');
var options = {
    templatesPath: 'templates/endpoint_unitTest',
    gulp: gulp
}

gulp.task('new-endpoint_unitTest', function () {
    //Se captura el nombre del endpoint a crear
    var name = _.isString(argv.endpoint_unitTest) == true ? argv.endpoint_unitTest : undefined;
    
    var nameValidation = fileGeneratorHelper.endpointNameValidation(name);
    if (nameValidation === false){
        return false;
    }
    pathExists(destination + name).then(exists => {
        if (exists === false) {
            //Se crean los archivos y directorios con la estructura de un endpoint
            dogen.config(options);
            dogen.task(placeholder, destination);
            console.log("Unit test created !!");
        } else {
            console.log("[ERROR] Already exists an endpoint with that name")
        }
    });
});    