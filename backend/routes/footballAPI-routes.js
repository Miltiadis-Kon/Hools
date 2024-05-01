//Imports
const express = require("express");
const router = express.Router();
const matchController = require('../controllers/footballAPI-controller');

//router.get( "/:league_id",matchController.getLeaguefromAPI);
router.get("/:league_id/:season_id",matchController.getStandingsfromAPI);

module.exports = router;
