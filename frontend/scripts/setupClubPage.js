const model = "https://hools.onrender.com";
//const model = "http://localhost:10000";



const fetchClubfromAPI = async () => {
      // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  // Get the clubId parameter
  const clubId = urlParams.get('club');
    const response = await fetch(model+`/clubs/${clubId}`);
    const data = await response.json();
    return data;
    };

const displayClub = async () => { 
    const result = await fetchClubfromAPI(); // get the club from the API
    const club_info = result._club[0]; // extract the club information from the result
    console.log(club_info);
    // Set club name
    const club_name = document.querySelector(".club-info .texts h1");
    club_name.innerHTML = club_info.name;

    // Set club logo
    const club_logo = document.querySelector(".club-info img");
    club_logo.src = club_info.logo;

    const club_bg = document.querySelector(".club-backround img");
    club_bg.src = club_info.logo;

    // Set next match
    const nextMatch = club_info.next_match;
    const homeTeam = document.querySelector(".upcomming-match .clubs .home");
    homeTeam.querySelector("img").src = nextMatch.teams.home.logo;
    homeTeam.querySelector("h3").innerHTML = nextMatch.teams.home.name;
    const awayTeam = document.querySelector(".upcomming-match .clubs .away");
    awayTeam.querySelector("img").src = nextMatch.teams.away.logo;
    awayTeam.querySelector("h3").innerHTML = nextMatch.teams.away.name;

    // Set match date
    //2024-05-15T17:00:00+00:00
    const date = new Date(nextMatch.fixture.date);
    const formattedDate = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
    const matchDate = document.querySelector(".upcomming-match .texts");
    matchDate.querySelector("h3").innerHTML = formattedDate;
    matchDate.querySelector("h4").innerHTML = formattedTime;


    // Set match venue
    const matchVenue = document.querySelector(".upcomming-match h2");
    matchVenue.innerHTML = nextMatch.fixture.venue.name;
};

displayClub();