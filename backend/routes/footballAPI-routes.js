//Imports
const express = require("express");
const router = express.Router();
const matchController = require('../controllers/footballAPI-controller');

router.get("/standings/:league_id/:season_id",matchController.getStandingsfromAPI);

router.get("/clubs/:club_id",matchController.getClubfromAPI);

router.get("/players/:club_id",matchController.getPlayersandCoachfromAPI);

router.get("/next_match/:club_id",matchController.getNextMatchfromAPI);

router.get("/matches/:match_id",matchController.getMatchfromAPI);

router.get("/upcoming/:league_id",matchController.getNextMatchesfromAPI);

router.get("/clubfromleague/:league_id",matchController.getClubsfromAPI);

module.exports = router;
