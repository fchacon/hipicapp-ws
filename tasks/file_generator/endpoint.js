/**
 * Creacion de endpoints automatizado
 * 
 * Comandos:
 *   - npm run new-endpoint NOMRBE_ENDPOINT
 *   - gulp new-endpoint --endpoint NOMRBE_ENDPOINT
 * 
 * Importante:
 *   - El nombre del endpoint debe ser singular y no puede comenzar con un numero
 *   - En la carpeta templates se debe definir esta definida la estructura de carpetas de los endpoint 
 */
'use strict';

var gulp = require('gulp');
var dogen = require('./custom_dogen.js');
var replace = require('gulp-replace');
var _ = require('lodash');
var pathExists = require('path-exists');
var argv = require('yargs').argv;
var fileGeneratorHelper = require('./helper.js');


var placeholder = 'endpoint';//este es el nombre del tag a reemplazar (nombre de directorios, clases, metodos, etc)
var destination = 'server/api/';//ruta de destino donde se crean los endpoints
var options = {
    templatesPath: 'templates/endpoint',
    gulp: gulp
}

gulp.task('new-endpoint', function () {
    //Se captura el nombre del endpoint a crear
    var name = _.isString(argv.endpoint) == true ? argv.endpoint : undefined;
    
    var nameValidation = fileGeneratorHelper.endpointNameValidation(name);
    if (nameValidation === false) {
        return false;
    }

    pathExists(destination + name).then(exists => {
        if(exists === false){
            //Se crean los archivos y directorios con la estructura de un endpoint
            dogen.config(options);
            dogen.task(placeholder, destination);

            //Se reemplazan tag especificos en el archivo routes
            gulp.src(['server/routes/index.js'])
                .pipe(
                    replace(
                        '/*__#GULP:SET_ROUTE#__*/',
                        'const ' + _.capitalize(name) +'Routes = require("../api/'+ name +'/route/'+ name +'-route");\n/*__#GULP:SET_ROUTE#__*/'
                    )
                )
                .pipe(
                    replace(
                        '/*__#GULP:INIT_ROUTE#__*/',
                        '' + _.capitalize(name) +'Routes.init(router);\n/*__#GULP:INIT_ROUTE#__*/'
                    )
                )        
                .pipe(
                    gulp.dest('server/routes')
                );
            console.log("Endpoint created !!");
        } else {
            console.log("[ERROR] Already exists an endpoint with that name")
        }
    });
});    