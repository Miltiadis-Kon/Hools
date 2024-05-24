//Imports
const express = require("express");
const router = express.Router();
const matchController = require('../controllers/api-club');
const api_players_controller = require('../controllers/api-players-controller');
const api_matches_controller = require('../controllers/api-matches-controller');
//Club related routes
router.get("/clubs/:club_id",matchController.getClubfromAPI); //get ONE club based on club_id
router.get("/clubfromleague/:league_id",matchController.getClubsfromAPI); //get ALL clubs based on league_id
router.get("/deleteAllClubs",matchController.deleteAllClubs); //delete all clubs from database
//Club info related routes
router.get("/players/:club_id",api_players_controller.getPlayersandCoachfromAPI); //get ALL players and coach based on club_id
router.get("/next_match/197/:club_id",api_matches_controller.getNextMatchfromAPI); //get the next match based on club_id
router.get("/last_match/197/:club_id",api_matches_controller.getLastMatchfromAPI); //get the last match based on club_id

//Match related routes
router.get("/matches/:match_id",api_matches_controller.getMatchfromAPI); //get ONE match based on match_id
router.get("/upcoming/:league_id",api_matches_controller.getNextMatchesfromAPI); //get ALL upcoming matches based on league_id
router.get("/recent_matches/:league_id",api_matches_controller.getRecentMatches); //get ALL recent matches based on league_id

//Standings related routes
router.get("/standings/:league_id/:season_id",api_matches_controller.getStandingsfromAPI); //get ALL standings based on league_id and season_id

module.exports = router;
