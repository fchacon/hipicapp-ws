"use strict";

const i18n = require("i18n");

class i18nConfig {
    static init(application) {
        i18n.configure({
            locales:['es', 'en'],
            directory: __dirname + '/locales',
            defaultLocale: 'es',
            api: {
                '__': 't',  //now req.__ becomes req.t 
                '__n': 'tn' //and req.__n can be called as req.tn 
            },
            register: global
        });
        
        application.use(i18n.init);
    }
}

module.exports = i18nConfig;
