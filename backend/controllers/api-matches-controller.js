const request = require("request");
const matchModel = require("../models/match");
const standingsModel = require("../models/standings");
const HttpError = require("../models/http-errors");
const clubModel = require("../models/club");


const getMatchfromAPI = async (req, res, next) => {
    const match_id = req.params.match_id;
    if (isNaN(parseInt(match_id))) {
      const error = new HttpError("Invalid club ID.", 400);
      return next(error);
    }s
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
    if (isNaN(parseInt(match_id))) {
      const error = new HttpError("Invalid club ID.", 400);
      return next(error);
    }
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
            console.log("Match not in DB, adding match...");
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
                console.log(`Added match: ${_m.footballAPI_id} to MongoDB successfully.`);
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
              console.log(`Match date: ${matchDate} Current date: ${currentDate} updating match...`);
              if (matchDate < currentDate) {
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
                console.log(`Updated match: ${updatedMatch.footballAPI_id} in MongoDB.`);
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
    if (isNaN(parseInt(club_id))) {
      const error = new HttpError("Invalid club ID.", 400);
      return next(error);
    }
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      qs: { next: "1", team: club_id },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
    //Search for the last match of the club on the DB 
    clubModel
      .findOne({ footballAPI_id: club_id })
      .then((matchesFromDB) => {
        if (matchesFromDB.length == 0) {
          const error = new HttpError("Could not find the club.", 404);
          return next(error);
        }
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          const jsonBody = JSON.parse(body);
          const next_match = jsonBody.response[0];
          if(jsonBody.response.length == 0)
            {
              const error = new HttpError("Could not find the next match.", 404);
              return next(error);
            }
            //Get further statistics and store match to DB
            getMatch(next_match.fixture.id);
          console.log("Next match added to MongoDB successfully  " + next_match.fixture.id);
          clubModel.findOneAndUpdate({ footballAPI_id: club_id },{$set: {next_match: next_match }}).
          then((updatedClub) => {
            console.log(`Updated club: ${updatedClub.footballAPI_id} in MongoDB.`);
          }).
          catch((err) => {
            return next(err);
          });
          return res.status(200).json("Success"); // return the player to the client
        });
      })
      .catch((err) => {
        const error = new HttpError("Could not find the club.", 404);
        return next(error);
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

const getLastMatchfromAPI = async (req, res, next) => {
    const club_id = req.params.club_id;
    if (isNaN(parseInt(club_id))) {
      const error = new HttpError("Invalid club ID.", 400);
      return next(error);
    }
    const options = {
      method: "GET",
      url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
      qs: { last: "1", team: club_id },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
      },
    };
    //Search for the last match of the club on the DB 
    clubModel
      .findOne({ footballAPI_id: club_id })
      .then((matchesFromDB) => {
        if (matchesFromDB.length == 0) {
          const error = new HttpError("Could not find the club.", 404);
          return next(error);
        }
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          const jsonBody = JSON.parse(body);
          const lastMatch = jsonBody.response[0];
          if(jsonBody.response.length == 0)
            {
              const error = new HttpError("Could not find the last match.", 404);
              return next(error);
            }
            //Get further statistics and store match to DB
            getMatch(lastMatch.fixture.id);
          console.log("Last match added to MongoDB successfully  " + lastMatch.fixture.id);
          clubModel.findOneAndUpdate({ footballAPI_id: club_id },{$set: {last_match: lastMatch }}).
          then((updatedClub) => {
            console.log(`Updated club: ${updatedClub.footballAPI_id} in MongoDB.`);
          }).
          catch((err) => {
            console.log(err);
          });
          res.json("Success"); // return the player to the client
        });
      })
      .catch((err) => {
        const error = new HttpError("Could not find the club.", 404);
        return next(error);
      });
  }



  module.exports = {
    getMatchfromAPI,
    getRecentMatches,
    getNextMatchesfromAPI,
    getNextMatchfromAPI,
    getStandingsfromAPI,
    getLastMatchfromAPI,
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


  class Match {
    constructor(
      footballAPI_id,
      date,
      time,
      referee,
      venue,
      match_status,
      score,
      home_team,
      home_scorers,
      home_statistics,
      home_formation,
      home_lineup,
      home_substitutes,
      away_team,
      away_scorers,
      away_statistics,
      away_formation,
      away_lineup,
      away_substitutes
    ) {
      this.footballAPI_id = footballAPI_id;
      this.home_team = home_team;
      this.away_team = away_team;
      this.score = score;
      this.date = date;
      this.time = time;
      this.venue = venue;
      this.home_statistics = home_statistics;
      this.away_statistics = away_statistics;
      this.home_scorers = home_scorers;
      this.away_scorers = away_scorers;
      this.home_lineup = home_lineup;
      this.away_lineup = away_lineup;
      this.home_substitutes = home_substitutes;
      this.away_substitutes = away_substitutes;
      this.home_formation = home_formation;
      this.away_formation = away_formation;
      this.match_status = match_status;
      this.referee = referee;
    }
  }