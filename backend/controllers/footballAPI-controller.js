const standingsModel = require("../models/standings");
const HttpError = require("../models/http-errors");

//To run once every day
const getLeaguefromAPI = async (req,res,next) =>
{
    var league_id = req.parms.league_id;
    var request = require("request");
    //Fetch data from sport-api 
var options = {
  method: 'GET',
  url: 'https://v3.football.api-sports.io/standings',
  qs: {league: league_id, season: '2023'},
  headers: {
    'X-RapidAPI-Key': 'f1067f680ed695a0463de28ec550d073',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);
    const standingsData = JSON.parse(body);
    const leagueData = standingsData.response[0].league;    
// Create new League instance
const league = new League(
    leagueData.id,
    leagueData.name,
    leagueData.country,
    leagueData.logo,
    leagueData.flag,
    leagueData.season
  );
  
  console.log(league);
    //Save data to mongo
});
}

const getStandingsfromAPI = async (req,res,next) =>
{
  const league_id = req.params.league_id;
  const season_id = req.params.season_id;
  var request = require("request");
const mongoose = require('mongoose');
  //Fetch data from sport-api 
var options = {
method: 'GET',
url: 'https://v3.football.api-sports.io/standings',
qs: {league: league_id, season: season_id},
headers: {
  'X-RapidAPI-Key': 'f1067f680ed695a0463de28ec550d073',
  'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
}
};

request(options, function (error, response, body) {
if (error) throw new Error(error);
    // Parse JSON body
  console.log(body);
  if(response==null)
  {
    const error = new HttpError("Could not find players.", 404);
    return next(error);  
  }
  const jsonBody = JSON.parse(body);

// Extract standings info
const standingsData = jsonBody.response[0].league.standings[0];
const leagueData = jsonBody.response[0].league;

// Create new Standings instances for the first 16 teams
const standings = standingsData.slice(0,12).map(teamData => new Standings(
  teamData.rank,
  teamData.team.id,
  teamData.team.name,
  teamData.team.logo,
  teamData.points,
  teamData.goalsDiff,
  teamData.form,
  teamData.status,
  teamData.description
));
const league = new League(
  leagueData.id,
  leagueData.name,
  leagueData.country,
  leagueData.logo,
  leagueData.flag,
  leagueData.season
);
console.log(league);
console.log(standings);
appendStandingstoMongo(league,standings,season_id);
res.json({ standings }); // return the player to the client
});
}


async function appendStandingstoMongo(league, data,season) {
    // Create a new document
    const standingsDocument = new standingsModel({
      league: league,
      standings: data,
      season:season
    });
    // Save the document to the database
    await standingsDocument.save();
    // Disconnect from MongoDB
    console.log('Standings added to MongoDB successfully');
}

//exports.getLeaguefromAPI = getLeaguefromAPI;
exports.getStandingsfromAPI = getStandingsfromAPI;


//Classes
class League {
    constructor(id, name, country, logo, flag, season) {
      this.id = id;
      this.name = name;
      this.country = country;
      this.logo = logo;
      this.flag = flag;
      this.season = season;
    }
  }

  class Standings {
    constructor(rank, teamId, teamName, teamLogo, points, goalsDiff, form, status, description) {
      this.rank = rank;
      this.teamId = teamId;
      this.teamName = teamName;
      this.teamLogo = teamLogo;
      this.points = points;
      this.goalsDiff = goalsDiff;
      this.form = form;
      this.status = status;
      this.description = description;
    }
  }