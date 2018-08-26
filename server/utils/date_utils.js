"use strict";

class DateUtils {
    static getMonthNumber(month_name, add_zero) {
        month_name = month_name.toLowerCase().trim();
        const months = ["enero", "febrero", "marzo", "abril", "mayo", 
            "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];
        
        const index = months.indexOf(month_name);
        return (index >= 0) ? index+1 : index;
    }
}

module.exports = DateUtils;
