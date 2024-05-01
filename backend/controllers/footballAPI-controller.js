const standingsModel = require("../models/standings");
const HttpError = require("../models/http-errors");
const request = require('request');
const mongoose = require('mongoose');
const clubModel = require('../models/club');

//To run once every day
const getLeaguefromAPI = async (req,res,next) =>
{
    var league_id = req.parms.league_id;
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

//TODO:IMPLEMENT THIS
const getNextMatchesfromAPI = async (req,res,next) =>
{
  const league_id = req.params.league_id;
const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
  qs: {next: '50', league: league_id},
  headers: {
    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

    // Parse JSON body
    const jsonBody = JSON.parse(body);
    const upcomingMatches = jsonBody.response;
    if(response==null)
    {
      const error = new HttpError("Could not find any matches.", 404);
      return next(error);  
    }
    //TODO: Save to database
    // Extract match info

  res.json({ upcomingMatches }); // return the player to the client
});

}

//TODO:IMPLEMENT THIS
const getClubfromAPI = async (req,res,next) =>
{
  const club_id = req.params.club_id;


}

//TODO:IMPLEMENT THIS
const getClubsfromAPI = async (req,res,next) =>
{
  const league_id = req.params.league_id;
  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/teams',
    qs: {league: league_id,season:"2023"},
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

      // Parse JSON body
      const jsonBody = JSON.parse(body);
      const club_data = jsonBody.response;
      if(response==null)
      {
        const error = new HttpError("Could not find any clubs.", 404);
        return next(error);  
      }
      const clubs =  club_data.map(club => 
        {
          clubModel.find({name:club.team.name}, function (err, clubsFromDB) {
            if (err) {
             const added_club =  new Club(
                club.team.id,
                club.team.name,
                club.team.logo,
                club.team.founded,
                club.venue.name,
                club.venue.capacity,
                club.venue.image
                );
                // Save to database
                clubModel.insertMany(added_club, function (err, docs) {
                  if (err) {
                    return console.error(err);
                  } else {
                    console.log(`Added club: ${added_club} to MongoDB successfully.`);
                  }
                });
            } else {
              console.log(`Club: ${club.team.name} already exists in MongoDB.`);
            }
      }
      );
    res.json({ clubs }); // return the player to the client
  });
});
}

//TODO:IMPLEMENT THIS
const getNextMatchfromAPI = async (req,res,next) =>
{
  const club_id = req.params.club_id;

const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
  qs: {next: '1', league: league_id,team:club_id,season:"2023"},
  headers: {
    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

    // Parse JSON body
    const jsonBody = JSON.parse(body);
    const upcomingMatch = jsonBody.response[0];
    if(response==null)
    {
      const error = new HttpError("Could not find any matches.", 404);
      return next(error);  
    }
    clubModel.find({footballAPI_id:club_id}, function (err, clubsFromDB) {
      if (err) {
        const error = new HttpError("Could not find the club.", 404);
        return next(error);  
      }
      const club = clubsFromDB[0];
      club.next_match = upcomingMatch;
      club.save();
    }
    );
  res.json({ upcomingMatch }); // return the player to the client
});


}

const getPlayersandCoachfromAPI = async (req,res,next) =>
{
  const club_id = req.params.club_id;
}

const getMatchfromAPI = async (req,res,next) =>
{
  const match_id = req.params.match_id;
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

//TODO:implement this
async function appendUpcomingMatchestoMongo(upcomingMatches)
{


}


//exports.getLeaguefromAPI = getLeaguefromAPI;
exports.getStandingsfromAPI = getStandingsfromAPI;
exports.getNextMatchesfromAPI = getNextMatchesfromAPI;
exports.getClubfromAPI = getClubfromAPI;
exports.getNextMatchfromAPI = getNextMatchfromAPI;
exports.getPlayersandCoachfromAPI = getPlayersandCoachfromAPI;
exports.getMatchfromAPI=getMatchfromAPI;
exports.getClubsfromAPI =getClubsfromAPI;


//Classes
class League {
    constructor(id, name, country, logo, flag, season) {
      this.footballAPI_id = id;
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

  class Club {
    constructor(id, name, logo, founded, field_name, field_capacity, field_img) {
      this.id = id;
      this.name = name;
      this.logo = logo;
      this.founded = founded;
      this.field_name = field_name;
      this.field_capacity = field_capacity;
      this.field_img = field_img;
    }
  }