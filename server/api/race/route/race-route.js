"use strict";

const RaceHipodromoChileController = require("../controller/race-hipodromochile-controller");
const RaceDatesHipodromoChileController = require("../controller/race-dates-hipodromochile-controller");
const RaceMiddleware = require("../middleware/race-middleware");

class RaceRoutes {
    static init(router) {
        /*router
            .route("/api/hipodromochile/races")
            .get(RaceMiddleware.checkParams, RaceHipodromoChileController.getAll)
            .post(RaceHipodromoChileController.createRace);

        router
            .route("/api/hipodromochile/races/:id")
            .delete(RaceHipodromoChileController.deleteRace);*/

        router.route("/api/hipodromochile/races/getLastDate").get(RaceDatesHipodromoChileController.scrapRaceDatesFromLast);

        router.route("/api/hipodromochile/races/scrapDates").get(RaceDatesHipodromoChileController.scrapRaceDates);

        router.route("/api/hipodromochile/races/scrap/:id").get(RaceHipodromoChileController.scrapRace);

        router.route("/api/hipodromochile/races/getIdsByDate").get(RaceHipodromoChileController.getRacesIdsByDate);

        router.route("/api/hipodromochile/races/scrapByDate").get(RaceHipodromoChileController.scrapRacesByDate);

        router.route("/api/hipodromochile/races/scrapByYear").get(RaceHipodromoChileController.scrapRacesByYear);

        router.route("/api/hipodromochile/races/excel").post(RaceHipodromoChileController.getExcel);
    }
}

module.exports = RaceRoutes;
