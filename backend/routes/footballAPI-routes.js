//Imports
const express = require("express");
const router = express.Router();
const matchController = require('../controllers/footballAPI-controller');

//Club related routes
router.get("/clubs/:club_id",matchController.getClubfromAPI); //get ONE club based on club_id
router.get("/clubfromleague/:league_id",matchController.getClubsfromAPI); //get ALL clubs based on league_id
router.get("/setup_clubs/:league_id",matchController.setUpclubs); //get ALL clubs based on league_id and save to database
//Club info related routes
router.get("/players/:club_id",matchController.getPlayersandCoachfromAPI); //get ALL players and coach based on club_id
router.get("/next_match/:club_id",matchController.getNextMatchfromAPI); //get the next match based on club_id

//Match related routes
router.get("/matches/:match_id",matchController.getMatchfromAPI); //get ONE match based on match_id
router.get("/upcoming/:league_id",matchController.getNextMatchesfromAPI); //get ALL upcoming matches based on league_id
router.get("/recent_matches/:league_id",matchController.getRecentMatches); //get ALL recent matches based on league_id

//Standings related routes
router.get("/standings/:league_id/:season_id",matchController.getStandingsfromAPI); //get ALL standings based on league_id and season_id

module.exports = router;
