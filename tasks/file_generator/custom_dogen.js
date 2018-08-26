/**
 * Descripcion: 
 * Archivo basado en el plugin gulp-dogen https://github.com/orizens/gulp-dogen
 * Crea archivos y directorios basados en un template
 * 
 * version: 1.0
 * version: 1.1 Se agregan funcionalidades para reeplazar variables capitalize.
 */

'use strict';
var gulp = require('gulp');
var argv = require('yargs').argv;
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var _ = require('lodash');
var _gulp;

var api = {
    config: config,
    task: task
};

var generators = [['list', '']];
var templatesPath = './';
var gulpTaskCreated = false;

function config(options) {
    if (!options.templatesPath || !options.gulp) {
        console.log('templatesPath or gulp parameters not set in config correctly.');
        return;
    }
    _gulp = options.gulp;
    templatesPath += options.templatesPath + '/';
}

function task(placeholder, destination) {
    if (placeholder && destination) {
        generators.push([placeholder, destination]);
        if (!gulpTaskCreated) {
            gulpTaskCreated = true;
            // this function should run once because it iterates on the flags
            // the 'dogen' task gets and runs the appropriate the generator
            createDogenGulpTask(placeholder);
        }
    }
}

function createDogenGulpTask(placeholder) {
    var placeholderKey = placeholder;
    var placeholderValue = argv[placeholderKey];
    var path = argv.path;

    if (argv.list) {
        listGeneratorsToConsole();
        return;
    }

    generators.forEach(function (task) {
        var placeholder = task[0];
        var destination = task[1];
        if (path !== undefined) {
            destination += path + '/';
        }
        if (placeholderValue !== undefined && placeholderKey === placeholder) {
            return creator(placeholder, placeholderValue, destination);
        }
    });

}

function creator(placeholder, placeholderValue, dest) {
    var templatePlaceholder = '_' + placeholder + '_';
    var reNormal = new RegExp('(' + templatePlaceholder + ')', 'gm');
    var reCamelCase = new RegExp('(=' + placeholder + '=)', 'gm');
    var placeholderValueCamelCase = _.camelCase(placeholderValue);
    var reCapitalize = new RegExp('(#' + placeholder + '#)', 'gm');
    var placeholderValueCapitalize = _.capitalize(placeholderValue);
    console.log('Creating', placeholder, ':', placeholderValue, 'in', dest);

    return _gulp.src(templatesPath + templatePlaceholder + '/**/*')
        .pipe(rename(function (path) {
            if (path.basename.indexOf(templatePlaceholder) > -1) {
                path.basename = path.basename.replace(templatePlaceholder, placeholderValue);
            }
        }))
        .pipe(replace(reNormal, placeholderValue))
        .pipe(replace(reCamelCase, placeholderValueCamelCase))
        .pipe(replace(reCapitalize, placeholderValueCapitalize))
        .pipe(_gulp.dest(dest + placeholderValue));
}

function listGeneratorsToConsole() {
    var list = generators.map(function (generator) {
        return '\t' + generator.join(': ');
    });
    list.shift();
    console.log('\navailable dogen tasks:\n');
    console.log(list.join('\n'), '\n');
}

module.exports = api;