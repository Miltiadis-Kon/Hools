const HttpError = require("../models/http-errors");
const request = require("request");
const clubModel = require("../models/club");

const getPlayersandCoachfromAPI = async (req, res, next) => {
  const club_id = req.params.club_id;
  var players = [];
  var coach = {};

  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/players",
    qs: { team: club_id, season: "2023" },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    const jsonBody = JSON.parse(response.body);
    if (response == null) {
      const error = new HttpError("Could not find players.", 404);
      console.log("ERROR PRESENTED ON THIS CLUB" + club_id);
      return next(error);
    }
    //Get paginated players
    if (jsonBody.paging.total > 1) {
      console.log(
        "More than 1 page of players. Fetching all players. Total number of pages = " +
          jsonBody.paging.total
      );
      for (let i = 1; i < jsonBody.paging.total + 1; i++) {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v3/players",
          qs: { team: club_id, season: "2023", page: i },
          headers: {
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          const jsonBody = JSON.parse(response.body);
          if (response == null) {
            const error = new HttpError("Could not find players.", 404);
            return next(error);
          }
          if (jsonBody.response.length > 0) {
            players = players.concat(jsonBody.response);
            console.log("Added players. Total number = " + players.length);
          }

          clubModel
            .findOneAndUpdate(
              { footballAPI_id: club_id },
              { $set: { players: players } },
              { new: true, useFindAndModify: false }
            )
            .then((club) => {
              if (!club) {
                const error = new HttpError("Could not find the club.", 404);
                return next(error);
              }
              console.log(
                "Players added to club. Total number : " + club.players.length
              );
            })
            .catch((err) => {
              console.log(err);
              const error = new HttpError("Could not find the club.", 404);
              return next(error);
            });
        });
      }
    }
  });

  const options2 = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/coachs",
    qs: { team: club_id },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };
  request(options2, function (error, response, body) {
    if (error) throw new Error(error);
    const jsonBody = JSON.parse(response.body);
    if (response == null) {
      const error = new HttpError("Could not find coach.", 404);
      return next(error);
    }
    if (jsonBody.response.length > 0) coach = jsonBody.response[0];

    clubModel
      .findOneAndUpdate(
        { footballAPI_id: club_id },
        { $set: { coach: coach } },
        { new: true, useFindAndModify: false }
      )
      .then((club) => {
        if (!club) {
          console.log("ERROR PRESENTED ON THIS CLUB" + club_id);
          const error = new HttpError("Could not find the club.", 404);
          return next(error);
        }
        console.log("Coach added to club. Coach name: " + coach.name);
      });
  });
  res.json("Success"); // return the player to the client
};



module.exports = {
  getPlayersandCoachfromAPI,
};
