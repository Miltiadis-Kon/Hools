async function fetchPlayers(club_id, i) {
    return new Promise((resolve, reject) => {
      const options = {
        url: "https://api-football-v1.p.rapidapi.com/v3/players",
        qs: { team: club_id, season: "2023", page: i },
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      };
  
      request(options, function (error, response, body) {
        if (error) reject(error);
        const jsonBody = JSON.parse(response.body);
        if (response == null) {
          const error = new HttpError("Could not find players.", 404);
          return next(error);
        }
        if (jsonBody.response.length > 0) {
          resolve(jsonBody.response);
        } else {
          resolve([]);
        }
      });
    });
  }
  
  // Usage
  async function getPlayers() {
    let players = [];
    for (let i = 0; i < totalPages; i++) {
      const newPlayers = await fetchPlayers(club_id, i);
      players = players.concat(newPlayers);
      console.log("Added players. Total number = " + players.length);
    }
    
    clubModel.find({ footballAPI_id: club_id }).then((matchesFromDB) => {
        if (matchesFromDB.length == 0) {
          const error = new HttpError("Could not find the club.", 404);
          return next(error);
        }
        const club = matchesFromDB[0];
        club.players = players;
        club.save();
        console.log("Players added to club. Total number : "+club.players.length );
      });
  }

  