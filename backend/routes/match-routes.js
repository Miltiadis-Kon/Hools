//Imports
const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match-controller");

///Define api endpoints
//GET
router.get("/standings/", (req, res, next) => {
    matchController.getstandings(req, res, next);
});

//Export module
module.exports = router;
