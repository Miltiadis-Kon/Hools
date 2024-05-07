//Imports
const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match-controller");

///Define api endpoints

//Get all standings
router.get("/standings/", (req, res, next) => {
    matchController.getstandings(req, res, next);
});

// Get a match by match_id
router.get("/match/:match_id", (req, res, next) => {
    matchController.get_match(req, res, next);
});
// Get all matches between two dates
// ex. /matches/24_04_24/24_05_20
router.get("/date/:from_date/:to_date", (req, res, next) => {
    matchController.get_matches(req, res, next);
});

//Export module
module.exports = router;
