const request = require("request");
const matchModel = require("../models/match");
const standingsModel = require("../models/standings");
const HttpError = require("../models/http-errors");


const getMatchfromAPI = async (req, res, next) => {
    const match_id = req.params.match_id;
    //GET MATCH
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      qs: { id: match_id },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
    request(options, function (error, response, body) {
      const jsonBody = JSON.parse(body);
      let info = jsonBody.response[0];
      //Store match details in MongoDB
      matchModel
        .find({ footballAPI_id: match_id })
        .then((matchesFromDB) => {
          if (matchesFromDB.length == 0) {
            //Get all scorers
            let h_scorers = [];
            let a_scorers = [];
  
            for (let i = 0; i < info.events.length; i++) {
              let event = info.events[i];
              if (event.type == "Goal") {
                let scorer = { player: event.player, time: event.time };
                if (event.team.id == info.teams.home.id) {
                  h_scorers.push(scorer);
                } else {
                  a_scorers.push(scorer);
                }
              }
            }
  
            const _m = new Match(
              (footballAPI_id = info.fixture.id),
              (date = info.fixture.date),
              (time = info.fixture.date),
              (referee = info.fixture.referee),
              (venue = info.fixture.venue),
              (match_status = info.fixture.status.short),
              (score = info.goals.home + " - " + info.goals.away),
              (home_team = info.teams.home),
              (home_scorers = h_scorers),
              (home_statistics = info.statistics[0].statistics),
              (home_formation = info.lineups[0].formation),
              (home_lineup = info.lineups[0].startXI),
              (home_substitutes = info.lineups[0].substitutes),
              (away_team = info.teams.away),
              (away_scorers = a_scorers),
              (away_statistics = info.statistics[1].statistics),
              (away_formation = info.lineups[1].formation),
  
              (away_lineup = info.lineups[1].startXI),
              (away_substitutes = info.lineups[1].substitutes)
            );
            matchModel.insertMany(_m).then(function (err, docs) {
              if (err) {
                return console.error(err);
              } else {
                console.log(`Added match: ${_m} to MongoDB successfully.`);
              }
            });
          } else console.log("Match already on DB");
        })
        .catch((err) => {
          console.log(err);
        });
      res.json({ info }); // return the player to the client
    });
  };
  
  const getMatch = (match_id) => {
    //GET MATCH
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      qs: { id: match_id },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
    request(options, function (error, response, body) {
      const jsonBody = JSON.parse(body);
      let info = jsonBody.response[0];
      //Store match details in MongoDB
      matchModel
        .find({ footballAPI_id: match_id })
        .then((matchesFromDB) => {
          if (matchesFromDB.length == 0) {
            //Get all scorers
            let h_scorers = [];
            let a_scorers = [];
  
            for (let i = 0; i < info.events.length; i++) {
              let event = info.events[i];
              if (event.type == "Goal") {
                let scorer = { player: event.player, time: event.time };
                if (event.team.id == info.teams.home.id) {
                  h_scorers.push(scorer);
                } else {
                  a_scorers.push(scorer);
                }
              }
            }
            console.log(info);
            let _m=null;
            //check if match is not played yet
            if (info.fixture.status.short == "NS") {
              _m = new Match(
                (footballAPI_id = info.fixture.id),
                (date = info.fixture.date),
                (time = info.fixture.date),
                (referee = info.fixture.referee),
                (venue = info.fixture.venue),
                (match_status = info.fixture.status.short),
                (score = info.goals.home + " - " + info.goals.away),
                (home_team = info.teams.home),
                (home_scorers = h_scorers),
                (home_statistics = []),
                (home_formation = []),
                (home_lineup = []),
                (home_substitutes = []),
                (away_team = info.teams.away),
                (away_scorers = a_scorers),
                (away_statistics =[]),
                (away_formation = []),
    
                (away_lineup = []),
                (away_substitutes = [])
              );
              
            }
            else
            {
            _m = new Match(
              (footballAPI_id = info.fixture.id),
              (date = info.fixture.date),
              (time = info.fixture.date),
              (referee = info.fixture.referee),
              (venue = info.fixture.venue),
              (match_status = info.fixture.status.short),
              (score = info.goals.home + " - " + info.goals.away),
              (home_team = info.teams.home),
              (home_scorers = h_scorers),
              (home_statistics = info.statistics[0].statistics),
              (home_formation = info.lineups[0].formation),
              (home_lineup = info.lineups[0].startXI),
              (home_substitutes = info.lineups[0].substitutes),
              (away_team = info.teams.away),
              (away_scorers = a_scorers),
              (away_statistics = info.statistics[1].statistics),
              (away_formation = info.lineups[1].formation),
  
              (away_lineup = info.lineups[1].startXI),
              (away_substitutes = info.lineups[1].substitutes)
            );
          }
            matchModel.insertMany(_m).then(function (err, docs) {
              if (err) {
                return console.error(err);
              } else {
                console.log(`Added match: ${_m} to MongoDB successfully.`);
              }
            });
          } else 
          {
              // Check date the match was added to the database
              // Check if the match has been played
              // If match has been played, update the match details
              // If match has not been played, do nothing
              const matchDate = new Date(info.fixture.date);
              const currentDate = new Date();
              if (matchDate < currentDate) {
              matchModel.findOneAndUpdate(
                { footballAPI_id: match_id },
                {
                $set: {
                  date: info.fixture.date,
                  time: info.fixture.date,
                  referee: info.fixture.referee,
                  venue: info.fixture.venue,
                  match_status: info.fixture.status.short,
                  score: info.goals.home + " - " + info.goals.away,
                  home_team: info.teams.home,
                  home_scorers: h_scorers,
                  home_statistics: info.statistics[0].statistics,
                  home_formation: info.lineups[0].formation,
                  home_lineup: info.lineups[0].startXI,
                  home_substitutes: info.lineups[0].substitutes,
                  away_team: info.teams.away,
                  away_scorers: a_scorers,
                  away_statistics: info.statistics[1].statistics,
                  away_formation: info.lineups[1].formation,
                  away_lineup: info.lineups[1].startXI,
                  away_substitutes: info.lineups[1].substitutes,
                },
                },
                { new: true }
              )
                .then((updatedMatch) => {
                console.log(`Updated match: ${updatedMatch} in MongoDB.`);
                })
                .catch((err) => {
                console.log(err);
                });
              }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  
  const getRecentMatches = async (req, res, next) => {
    const league_id = req.params.league_id;
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      qs: { last: "5", league: league_id },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const jsonBody = JSON.parse(body);
      const recentMatches = jsonBody.response;
      if (response == null) {
        const error = new HttpError("Could not find any matches.", 404);
        return next(error);
      }
      recentMatches.map((match) => {
        getMatch(match.fixture.id);
      });
      res.json({ recentMatches }); // return the player to the client
    });
  };
  
  const getNextMatchesfromAPI = async (req, res, next) => {
    const league_id = req.params.league_id;
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      qs: { next: "5", league: league_id },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const jsonBody = JSON.parse(body);
      const recentMatches = jsonBody.response;
      if (response == null) {
        const error = new HttpError("Could not find any matches.", 404);
        return next(error);
      }
      recentMatches.map((match) => {
        getMatch(match.fixture.id);
      });
      res.json({ recentMatches }); // return the player to the client
    });
  };

  const getNextMatchfromAPI = async (req, res, next) => {
    const club_id = req.params.club_id;
    const league_id = req.params.league_id;
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      qs: { next: "1", league: league_id, team: club_id, season: "2023" },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
  
      // Parse JSON body
      const jsonBody = JSON.parse(body);
      const upcomingMatch = jsonBody.response[0];
      if (response == null) {
        const error = new HttpError("Could not find any matches.", 404);
        return next(error);
      }
      clubModel
        .find({ footballAPI_id: club_id })
        .then((matchesFromDB) => {
          if (matchesFromDB.length == 0) {
            const error = new HttpError("Could not find the club.", 404);
            return next(error);
          }
          const club = matchesFromDB[0];
          club.next_match = upcomingMatch;
          club.save();
        })
        .catch((err) => {
          const error = new HttpError("Could not find the club.", 404);
          return next(error);
        });
      res.json("Success"); // return the player to the client
    });
  };
  
const getStandingsfromAPI = async (req, res, next) => {
    const league_id = req.params.league_id;
    const season_id = req.params.season_id;
    //Fetch data from sport-api
    var options = {
      method: "GET",
      url: "https://v3.football.api-sports.io/standings",
      qs: { league: league_id, season: season_id },
      headers: {
        "X-RapidAPI-Key": "f1067f680ed695a0463de28ec550d073",
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      // Parse JSON body
      console.log(body);
      if (response == null) {
        const error = new HttpError("Could not find players.", 404);
        return next(error);
      }
      const jsonBody = JSON.parse(body);
  
      // Extract standings info
      const getStandingsPointer = jsonBody.response[0].league.standings.length - 1;
      const standingsData = jsonBody.response[0].league.standings[getStandingsPointer];
      const leagueData = jsonBody.response[0].league;
  
      // Create new Standings instances for the first 16 teams
      const standings = standingsData
        .map(
          (teamData) =>
            new Standings(
              teamData.rank,
              teamData.team.id,
              teamData.team.name,
              teamData.team.logo,
              teamData.points,
              teamData.all.played,
              teamData.all.win,
              teamData.all.draw,
              teamData.all.lose,
              teamData.goalsDiff,
              teamData.form
            )
        );
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
      appendStandingstoMongo(league, standings, season_id);
      res.json({ standings }); // return the player to the client
    });
  };
  
async function appendStandingstoMongo(league, data, season) {
  //Destroy the existing standings data
  standingsModel.deleteMany({ league: league }).then(function () {
    console.log("Data deleted"); // Success
  }
  ).catch(function (error) {
    console.log(error); // Failure
  }
  );

    // Create a new document
    const standingsDocument = new standingsModel({
      league: league,
      standings: data,
      season: season,
    });
    // Save the document to the database
    await standingsDocument.save();
    // Disconnect from MongoDB
    console.log("Standings added to MongoDB successfully");
  }


  module.exports = {
    getMatchfromAPI,
    getRecentMatches,
    getNextMatchesfromAPI,
    getNextMatchfromAPI,
    getStandingsfromAPI,
  };


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
    constructor(
      rank,
      teamId,
      teamName,
      teamLogo,
      points,
      played,
      wins,
      defeats,
      losses,
      goaldiff,
      form
    ) {
      this.rank = rank;
      this.teamId = teamId;
      this.teamName = teamName;
      this.teamLogo = teamLogo;
      this.points = points;
      this.played = played;
      this.wins = wins;
      this.defeats = defeats;
      this.losses = losses;
      this.goaldiff = goaldiff;
      this.form = form;
    }
  }