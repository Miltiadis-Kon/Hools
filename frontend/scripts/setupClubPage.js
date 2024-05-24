const model = "https://hools.onrender.com";
//const model = "http://localhost:5000";

const fetchClubfromAPI = async () => {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  // Get the clubId parameter
  const clubId = urlParams.get("club");
  const response = await fetch(model + `/clubs/${clubId}`);
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

  const bg = document.querySelector(".club-background-image");
  bg.style.backgroundImage = `url(${club_info.logo})`;

  // Set next match
  let nextMatch = club_info.next_match;

    if(nextMatch == null || nextMatch == undefined)
    {
        nextMatch = club_info.last_match;
        document.querySelector(".upcoming-match h1").textContent = "Last Match";
        document.querySelector(".clubs .score h1").textContent = "  "+nextMatch.goals.home + " - " + nextMatch.goals.away+"  ";
        document.querySelector(".btn-reserve").style.display = "none";
    }
  const homeTeam = document.querySelector(".upcoming-match .clubs .home");
  homeTeam.querySelector("img").src = nextMatch.teams.home.logo;
  homeTeam.querySelector("h3").innerHTML = nextMatch.teams.home.name;
  const awayTeam = document.querySelector(".upcoming-match .clubs .away");
  awayTeam.querySelector("img").src = nextMatch.teams.away.logo;
  awayTeam.querySelector("h3").innerHTML = nextMatch.teams.away.name;
  // Set match date
  //2024-05-15T17:00:00+00:00
  const date = new Date(nextMatch.fixture.date);
  const formattedDate = `${date.getDate()} / ${
    date.getMonth() + 1
  } / ${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${date.getMinutes()}`;
  const matchDate = document.querySelector(".upcoming-match .texts");
  matchDate.querySelector("h3").innerHTML = formattedDate;
  matchDate.querySelector("h4").innerHTML = formattedTime;

  const matchFixture = document.querySelector(".upcoming-match-background");
  if(nextMatch.fixture.venue.id == null || nextMatch.fixture.venue.id == 19785){
    matchFixture.style.backgroundImage = `url(./images/opapArena.png)`;
    } else
  matchFixture.style.backgroundImage = `url(https://media.api-sports.io/football/venues/${nextMatch.fixture.venue.id}.png)`;

  // Set match venue
  const matchVenue = document.querySelector(".upcoming-match h2");
  matchVenue.innerHTML = nextMatch.fixture.venue.name;
  // Set club stats
  createStandingsCard(club_info.footballAPI_id);
};

const createStandingsCard = async (clubId) => {
  //Get stasndings from API
  const response = await fetch(model + "/matches/standings");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  const stds = data.standings[0].standings;

  //Find club by clubID in standings

  let team = stds.find((team) => team.teamId == clubId);

  console.log(team);

  // Get the template and clone it
  const standingsHome = document.querySelector(
    ".standingsTable .standingsCards"
  );

  // Set the team name, logo, and rank
  standingsHome.querySelector(".position h2").textContent = team.rank;

  if (team.rank == "1") {
    standingsHome.style.backgroundColor = "var(--tritery)";
  } else if (team.rank == "2" || team.rank == "3") {
    standingsHome.style.backgroundColor = "var(--secondary)";
  } else {
    standingsHome.style.backgroundColor = "var(--primary)";
  }

  standingsHome.querySelector(".generalclubinfo img").src = team.teamLogo;
  standingsHome.querySelector(".generalclubinfo img").alt = team.teamName;
  standingsHome.querySelector(".generalclubinfo h3").textContent =
    team.teamName;
  const statArray = [
    team.points,
    team.played,
    team.wins,
    team.defeats,
    team.losses,
    team.goaldiff,
  ];
  standingsHome.querySelectorAll(".points span").forEach((span, index) => {
    span.textContent = statArray[index];
  });

  // Set the last five matches
  const lastFiveMatches = team.form.split("");
  for (let i = 0; i < lastFiveMatches.length; i++) {
    const match = lastFiveMatches[i];
    const matchElement = document.createElement("img");
    if (match === "W") {
      matchElement.src = "images/accept.png";
      matchElement.alt = "win";
    } else if (match === "D") {
      matchElement.src = "images/minus.png";
      matchElement.alt = "draw";
    } else {
      matchElement.src = "images/delete-button.png";
      matchElement.alt = "loss";
    }
    standingsHome.querySelector(".lastfivematches").appendChild(matchElement);
  }
};

displayClub();
