"use strict";

class Utils {
    static sortRaces(races) {
        let i;
        let _races = [];
        for(let i = 1; i <= races.length; i++) {
            races.forEach((race) => {
                if(i == race.number) {
                    _races.push(race);
                    return false;
                }
            });
        }

        return _races;
    }
}

module.exports = Utils;
