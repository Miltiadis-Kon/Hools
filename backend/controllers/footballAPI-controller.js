const standingsModel = require("../models/standings");
const HttpError = require("../models/http-errors");
const request = require("request");
const mongoose = require("mongoose");
const clubModel = require("../models/club");
const club = require("../models/club");
const matchModel = require("../models/match");

//To run once every day
const getLeaguefromAPI = async (req, res, next) => {
  var league_id = req.parms.league_id;
  //Fetch data from sport-api
  var options = {
    method: "GET",
    url: "https://v3.football.api-sports.io/standings",
    qs: { league: league_id, season: "2023" },
    headers: {
      "X-RapidAPI-Key": "f1067f680ed695a0463de28ec550d073",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
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
    const standingsData = jsonBody.response[0].league.standings[0];
    const leagueData = jsonBody.response[0].league;

    // Create new Standings instances for the first 16 teams
    const standings = standingsData
      .slice(0, 12)
      .map(
        (teamData) =>
          new Standings(
            teamData.rank,
            teamData.team.id,
            teamData.team.name,
            teamData.team.logo,
            teamData.points,
            teamData.goalsDiff,
            teamData.form,
            teamData.status,
            teamData.description
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

    // Parse JSON body
    const jsonBody = JSON.parse(body);
    const upcomingMatches = jsonBody.response;
    if (response == null) {
      const error = new HttpError("Could not find any matches.", 404);
      return next(error);
    }
    //TODO: Save to database
    upcomingMatches.map((match) => {
      const _m = new Match(
        match.fixture.id,
        match.fixture.referee,
        match.teams.home,
        match.teams.away,
        match.goals.home + " - " + match.goals.away,
        match.fixture.date,
        match.fixture.date,
        match.venue,
        getStatistics(match.fixture.id)
      );

      matchModel
        .find({ footballAPI_id: match.fixture.id })
        .then((matchesFromDB) => {
          if (matchesFromDB.length == 0) {
            matchModel.insertMany(_m).then(function (err, docs) {
              if (err) {
                return console.error(err);
              } else {
                console.log(`Added match: ${_m} to MongoDB successfully.`);
              }
            });
          } else console.log("Match already on DB");
        });

      // Save to database
      matchModel.insertMany(_m).then(function (err, docs) {
        if (err) {
          return console.error(err);
        } else {
          console.log(`Added match: ${_m} to MongoDB successfully.`);
        }
      });
    });
    res.json({ upcomingMatches }); // return the player to the client
  });
};

const getClubfromAPI = async (req, res, next) => {
  const club_id = req.params.club_id;
};

const getClubsfromAPI = async (req, res, next) => {
  const league_id = req.params.league_id;
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/teams",
    qs: { league: league_id, season: "2023" },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    // Parse JSON body
    const jsonBody = JSON.parse(body);
    const club_data = jsonBody.response;
    if (response == null) {
      const error = new HttpError("Could not find any clubs.", 404);
      return next(error);
    }
    const clubs = club_data.map((club) => {
      clubModel.find({ name: club.team.name }).then(function (err, docs) {
        if (err) {
          const added_club = new Club(
            club.team.id,
            club.team.name,
            club.team.logo,
            club.team.founded,
            club.venue.name,
            club.venue.capacity,
            club.venue.image
          );
          // Save to database
          clubModel.insertMany(added_club).then(function (err, docs) {
            if (err) {
              return console.error(err);
            } else {
              console.log(`Added club: ${added_club} to MongoDB successfully.`);
            }
          });
        } else {
          console.log(`Club: ${club.team.name} already exists in MongoDB.`);
        }
      });
    });
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
    res.json("Success" ); // return the player to the client
  });
};

const getPlayersandCoachfromAPI = async (req, res, next) => {
  const club_id = req.params.club_id;
  let players = [];
  let coach = {};
  const options = {
    method: "GET",
    url: 'https://api-football-v1.p.rapidapi.com/v3/players',
    qs: { team: club_id,season: '2023'},
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const jsonBody = JSON.parse(response.body);
    if (response == null) {
      const error = new HttpError("Could not find players.", 404);
      return next(error);
    }
    if(jsonBody.response.length > 0)
    players = jsonBody.response;

    clubModel.find({ footballAPI_id : club_id })
    .then((matchesFromDB) => {
      if (matchesFromDB.length == 0) {
        const error = new HttpError("Could not find the club.", 404);
        return next(error);
      }
      const club = matchesFromDB[0];
      club.players = players;
      club.save();
    });  
  });

  const options2 = {
    method: "GET",
    url: 'https://api-football-v1.p.rapidapi.com/v3/coachs',
    qs: { team: club_id},
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    },
  };
  request(options2, function (error, response, body) {
    if (error) throw new Error(error);
    const jsonBody = JSON.parse(response.body);
    if (response == null) {
      const error = new HttpError("Could not find coach.", 404);
      return next(error);
    }
    if(jsonBody.response.length > 0)
    coach = jsonBody.response[0];

    clubModel.find({ footballAPI_id : club_id })
    .then((matchesFromDB) => {
      if (matchesFromDB.length == 0) {
        const error = new HttpError("Could not find the club.", 404);
        return next(error);
      }
      const club = matchesFromDB[0];
      club.coach = coach;
      club.save();
    });
  });
  res.json("Success"); // return the player to the client
};

const setUpclubs = async (req, res, next) => {
  const league_id = req.params.league_id;
  let club_ids = [];
  getClubsfromAPI(league_id, function (clubs) {
    club_ids = clubs.map((club) => club.footballAPI_id);
  });
  club_ids.forEach((club) => {
    getPlayersandCoachfromAPI(club);
    getNextMatchfromAPI(club);
  });
};

const getMatchfromAPI = async (req, res, next) => {
  const match_id = req.params.match_id;
  //GET MATCH
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
    qs: { fixture: match_id },
    headers: {
      "X-RapidAPI-Key": "84f63e80f5mshea51795cf0207b4p1f3db4jsn6322216a163c",
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };
  const match = request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const jsonBody = JSON.parse(body);
    if (response == null) {
      const error = new HttpError("Could not find the match.", 404);
      return next(error);
    }
    return jsonBody.response;
  });
  //Store match details in MongoDB
  matchModel.find({ footballAPI_id: match_id })
  .then((matchesFromDB)=>{
    if(matchesFromDB.length == 0){
      const _m = new Match(
        match.fixture.id,
        match.fixture.referee,
        match.teams.home,
        match.teams.away,
        match.goals.home + " - " + match.goals.away,
        match.fixture.date,
        match.fixture.date,
        match.fixture.venue,
        getStatistics(match.fixture.id)
      );
      matchModel.insertMany(_m).then(function (err, docs) {
        if (err) {
          return console.error(err);
        } else {
          console.log(`Added match: ${_m} to MongoDB successfully.`);
        }
      });
    }
    else console.log("Match already on DB");
  })
  .catch((err)=>{
    console.log(err);
  });
  res.json({ match }); // return the player to the client
};

const getRecentMatches = async (req, res, next) => {
  const league_id = req.params.league_id;
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
    qs: { last: "1", league: league_id },
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
    let ctr = 0;
    recentMatches.map((match) => {
      const _m = new Match(
        match.fixture.id,
        match.fixture.referee,
        match.teams.home,
        match.teams.away,
        match.goals.home + " - " + match.goals.away,
        match.fixture.date,
        match.fixture.date,
        match.fixture.venue,
        getStatistics(match.fixture.id)
      );
      console.log(++ctr);
      // Save to database
      matchModel
        .find({ footballAPI_id: match.footballAPI_id })
        .then((matchesFromDB) => {
          if (matchesFromDB.length == 0) {
            matchModel.insertMany(_m).then(function (err, docs) {
              if (err) {
                return console.error(err);
              } else {
                console.log(`Added match: ${ctr} to MongoDB successfully.`);
              }
            });
          } else console.log("Match already on DB");
        })
        .catch((err) => {
          console.log(err);
        });
    });
    res.json({ recentMatches }); // return the player to the client
  });
};

const getStatistics = async (match_id) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics",
    qs: { fixture: match_id },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const jsonBody = JSON.parse(body);
    if (response == null) {
      const error = new HttpError("Could not find the match statistics.", 404);
      return next(error);
    }
    return jsonBody.response;
  });
};

async function appendStandingstoMongo(league, data, season) {
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

//MATCH RELATED ENDPOINTS
exports.getRecentMatches = getRecentMatches;
exports.getNextMatchesfromAPI = getNextMatchesfromAPI;
exports.getMatchfromAPI = getMatchfromAPI;

//CLUB RELATED ENDPOINTS
exports.setUpclubs = setUpclubs;
exports.getClubsfromAPI = getClubsfromAPI;
exports.getClubfromAPI = getClubfromAPI;
//club info related endpoints
exports.getPlayersandCoachfromAPI = getPlayersandCoachfromAPI;
exports.getNextMatchfromAPI = getNextMatchfromAPI;

//STANDINGS ENDPOINTS
exports.getStandingsfromAPI = getStandingsfromAPI;

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
  constructor(
    rank,
    teamId,
    teamName,
    teamLogo,
    points,
    goalsDiff,
    form,
    status,
    description
  ) {
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
  constructor(
    name,
    footballAPI_id,
    logo,
    founded,
    field_name,
    field_capacity,
    field_img,
    tickets_link,
    players,
    leagueStanding,
    matches,
    next_match,
    coach
  ) {
    this.footballAPI_id = footballAPI_id;
    this.name = name;
    this.logo = logo;
    this.founded = founded;
    this.field_name = field_name;
    this.field_capacity = field_capacity;
    this.field_img = field_img;
    this.tickets_link = tickets_link;
    this.players = players;
    this.leagueStanding = leagueStanding;
    this.matches = matches;
    this.next_match = next_match;
    this.coach = coach;
  }
}
class Match {
  constructor(
    footballAPI_id,
    referee,
    home_team,
    away_team,
    score,
    date,
    time,
    venue,
    statistics
  ) {
    this.footballAPI_id = footballAPI_id;
    this.referee = referee;
    this.home_team = home_team;
    this.away_team = away_team;
    this.score = score;
    this.date = date;
    this.time = time;
    this.venue = venue;
    this.statistics = statistics;
  }
}
