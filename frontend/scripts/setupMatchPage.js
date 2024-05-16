const model = "https://hools.onrender.com";
//const model = "http://localhost:10000";


const fetchMatchFromAPI = async () => {

    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the matchId parameter
    const matchId = urlParams.get('match');
    
    const response = await fetch(model+`/matches/match/${matchId}`);
    const data = await response.json();
    return data;
    };

const displayMatch = async () => {
    const result = await fetchMatchFromAPI(); // get the match from the API
    const match_info = result._m[0]; // extract the match information from the result
    console.log(match_info);
    // Set match date
    //2024-05-15T17:00:00+00:00
    const date = new Date(match_info.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
    
    //Add venue
    const venue = document.querySelector(".match-card h1");
    venue.innerHTML = match_info.venue.name;

    //Add date 
    const matchDate = document.querySelector(".match-card h2");
    matchDate.innerHTML = formattedDate + " " + formattedTime;

    // Set teams
    const homeTeam = document.querySelector(".match-card .club-info [home]");
    homeTeam.querySelector("img").src = match_info.home_team.logo;
    homeTeam.querySelector("h2").innerHTML = match_info.home_team.name;

    const awayTeam = document.querySelector(".match-card .club-info [away]");
    awayTeam.querySelector("img").src = match_info.away_team.logo;
    awayTeam.querySelector("h2").innerHTML = match_info.away_team.name;

    //Set score
    const score = document.querySelector(".match-card .club-info h1");
    score.innerHTML = match_info.score;

    // home scorers
    const homeScorers = document.querySelector(".match-card .scorrers .homeScorrer");
    if (match_info.home_scorers.length==0) {
    } else
    {
        match_info.home_scorers.forEach(scorer => {
            const scorerDiv = document.createElement('p');
            scorerDiv.innerHTML = scorer.name;
            homeScorers.appendChild(scorerDiv);
        });
    }
    // away scorers
    const awayScorers = document.querySelector(".match-card .scorrers .awayScorrer");
    if (match_info.away_scorers.length==0) {
    } else
    {
        console.log(match_info.away_scorers);
        match_info.away_scorers.forEach(scorer => {
            console.log(scorer.name);
            const scorerDiv = document.createElement('p');
            scorerDiv.innerHTML = scorer.name;
            awayScorers.appendChild(scorerDiv);
        });
    }

    //home players
    const homeInfo = document.querySelector(".info .lineup .home .general");
    homeInfo.querySelector("h1").innerHTML = match_info.home_team.name;
    //TODO: Add coach
    homeInfo.querySelector("h3").src = match_info.home_team.name;

    const homePlayers = document.querySelector(".info .lineup .home .players-container");
    // Assuming match_info.home_team.players is an array of player objects
    match_info.home_lineup.forEach(player => {
    // Create a new div for the player card
    const playerCard = document.createElement('div');
    playerCard.className = "player-card";

    // Create divs for the number, position, and name
    const numberDiv = document.createElement('div');
    numberDiv.className = "number";
    const numberH3 = document.createElement('h3');
    numberH3.textContent = player.player.number;
    numberDiv.appendChild(numberH3);

    const positionDiv = document.createElement('div');
    positionDiv.className = "position";
    const positionH3 = document.createElement('h3');
    positionH3.textContent = player.player.pos;
    positionDiv.appendChild(positionH3);

    const nameDiv = document.createElement('div');
    nameDiv.className = "name";
    const nameH3 = document.createElement('h3');
    nameH3.textContent = player.player.name;
    nameDiv.appendChild(nameH3);

    // Append all divs to the player card
    playerCard.appendChild(numberDiv);
    playerCard.appendChild(positionDiv);
    playerCard.appendChild(nameDiv);

    // Append the player card to the homePlayers div
    homePlayers.appendChild(playerCard);
});

//away players
const awayInfo = document.querySelector(".info .lineup .away .general");
awayInfo.querySelector("h1").innerHTML = match_info.away_team.name;
awayInfo.querySelector("h3").src = match_info.away_team.name;
const awayPlayers = document.querySelector(".info .lineup .away .players-container");
match_info.away_lineup.forEach(player => {
// Create a new div for the player card
const playerCard = document.createElement('div');
playerCard.className = "player-card";

// Create divs for the number, position, and name
const numberDiv = document.createElement('div');
    numberDiv.className = "number";
    const numberH3 = document.createElement('h3');
    numberH3.textContent = player.player.number;
    numberDiv.appendChild(numberH3);

    const positionDiv = document.createElement('div');
    positionDiv.className = "position";
    const positionH3 = document.createElement('h3');
    positionH3.textContent = player.player.pos;
    positionDiv.appendChild(positionH3);

    const nameDiv = document.createElement('div');
    nameDiv.className = "name";
    const nameH3 = document.createElement('h3');
    nameH3.textContent = player.player.name;
    nameDiv.appendChild(nameH3);

    // Append all divs to the player card
    playerCard.appendChild(numberDiv);
    playerCard.appendChild(positionDiv);
    playerCard.appendChild(nameDiv);

    // Append the player card to the homePlayers div
    awayPlayers.appendChild(playerCard);
});

//stats
const stats = document.querySelector(".info .stats");



// Create a list of unique stat types
const statTypes = [...new Set([...match_info.home_statistics.map(stat => stat.type), ...match_info.away_statistics.map(stat => stat.type)])];

// List of stat types to remove
const removeTypes = ['expected_goals', 'Shots insidebox','Shots outsidebox','Shots off Goal','Goalkeeper Saves','Fouls','Blocked Shots','Passes accurate','Passes %',''];

// Filter out the types you want to remove
const filteredStatTypes = statTypes.filter(statType => !removeTypes.includes(statType));

filteredStatTypes.forEach(statName => {
    let homeStat;
    for (let stat of match_info.home_statistics) {
        if (stat.type === statName) {
            homeStat = stat.value;
            break;
        }
    }

    let awayStat;
    for (let stat of match_info.away_statistics) {
        if (stat.type === statName) {
            awayStat = stat.value;
            break;
        }
    }

    // Create a new div for the stats card
    const statsCard = document.createElement('div');
    statsCard.className = "stats-card";

    // Create h3 for the stat name
    const h3 = document.createElement('h3');
    h3.textContent = statName;
    statsCard.appendChild(h3);

    // Create divs for the bar, home stat, line, and away stat
    const barDiv = document.createElement('div');
    barDiv.className = "bar";
    if (homeStat === undefined || homeStat === null) {
        homeStat = 0;
    }
    if (awayStat === undefined || awayStat === null) {
        awayStat = 0;
    }
    //Remove the percentage sign from the stat name
    if (homeStat.toString().includes('%')) {
        homeStat = homeStat.replace('%','');
        //turn the string into a number
        homeStat = parseFloat(homeStat);
    }
    if (awayStat.toString().includes('%')) {
        awayStat = awayStat.replace('%','');
        //turn the string into a number
        awayStat = parseFloat(awayStat);
    }
    const homeStatDiv = document.createElement('div');
    homeStatDiv.className = "home-stat";
    homeStatDiv.textContent = `${homeStat}`;
    const lineDiv = document.createElement('div');
    lineDiv.className = "line";
    var percent = (homeStat/(homeStat+awayStat))*100;
    lineDiv.style.background = `repeating-linear-gradient(90deg,var(--accent),var(--accent) ${percent}%,var(--secondary) ${percent}%, var(--secondary) 100%)`;
    const awayStatDiv = document.createElement('div');
    awayStatDiv.className = "away-stat";

    awayStatDiv.textContent = `${awayStat}`;

    // Append all divs to the bar div
    barDiv.appendChild(homeStatDiv);
    barDiv.appendChild(lineDiv);
    barDiv.appendChild(awayStatDiv);

    // Append the bar div to the stats card
    statsCard.appendChild(barDiv);

    // Append the stats card to the stats div
    stats.appendChild(statsCard);
});

};

const setFootballfield = async () => {
    const result = await fetchMatchFromAPI(); // get the match from the API
    const match_info = result._m[0]; // extract the match information from the result
    console.log(match_info);


    const homePlayers = document.querySelector(".containerFF .players .home");
    const awayPlayers = document.querySelector(".containerFF .players .away");

    const home_formation = match_info.home_lineup;

    console.log(match_info.home_formation[0]);

    home_formation.forEach(player => {
        const playerGrid = player.player.grid;
        const playerNumber = player.player.number;
        Array.from(homePlayers.children).forEach(child => {
          const childId = child.id;
          if (playerGrid === childId) {
            child.textContent="";
            child.style.visibility = 'visible';
            const playerNumberH2 = document.createElement('h2');
            playerNumberH2.style.font = "3.5em sans-serif"
            playerNumberH2.textContent = playerNumber;
            child.appendChild(playerNumberH2);
          }
        });
      });

    const away_formation = match_info.away_lineup;
      console.log(match_info.away_formation[0]);
    away_formation.forEach(player => {
        const playerGrid = player.player.grid;
        const playerNumber = player.player.number;
      
        Array.from(awayPlayers.children).forEach(child => {
          const childId = child.id;
      
          if (playerGrid === childId) {
            child.textContent="";
            child.style.visibility = 'visible';
            const playerNumberH2 = document.createElement('h2');
            playerNumberH2.style.font = "3.5em sans-serif"
            playerNumberH2.textContent = playerNumber;
            child.appendChild(playerNumberH2);
          }
        });
      });
}

displayMatch();

setFootballfield();