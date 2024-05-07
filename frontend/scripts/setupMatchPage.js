const fetchMatchFromAPI = async () => {

    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the matchId parameter
    const matchId = urlParams.get('match');
    
    const response = await fetch(`http://localhost:5000/matches/match/1183769`);
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
    const formattedDate = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
    
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
    const homeScorers = document.querySelector(".match-card .scorers .homeScorrer");
    homeScorers.innerHTML = match_info.home_scorers;
    
};

displayMatch();