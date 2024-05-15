const standings_home_template = document.querySelector('[standings-home-template]');
const standings_home_container = document.querySelector('[standings_home_container]');


const getStandings = async () => {
    const response = await fetch(model+"/matches/standings");
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!data) {
        throw new Error("No data found");
    }
    const stds = data.standings[0].standings;
    console.log(stds);
   for (let i = 0; i < stds.length; i++) {
       let team_data = stds[i];
       console.log(team_data);
       createStandingsCard(team_data);
   }
    }

const createStandingsCard = (team) => {
    // Get the template and clone it
    const standingsHome = standings_home_template.content.cloneNode(true);

    // Set the team name, logo, and rank
    standingsHome.querySelector(".position h2").textContent = team.rank;
    standingsHome.querySelector(".generalclubinfo img").src = team.teamLogo;
    standingsHome.querySelector(".generalclubinfo img").alt = team.teamName;
    standingsHome.querySelector(".generalclubinfo h3").textContent = team.teamName;
    const statArray = [team.points,team.played, team.wins, team.defeats, team.losses, team.goaldiff];
    standingsHome.querySelectorAll(".points span").forEach((span, index) => {
        span.textContent = statArray[index];
    });

    // Set the last five matches
    const lastFiveMatches = team.form.split("");
    for (let i = 0; i < lastFiveMatches.length; i++) {
        const match = lastFiveMatches[i];
        const matchElement = document.createElement("img");
        if (match === "W") {
            matchElement.src = "images/accept.png"
            matchElement.alt = "win";
        } else if (match === "D") {
            matchElement.src = "images/minus.png"
            matchElement.alt = "draw";
        }
        else {
            matchElement.src = "images/delete-button.png"
            matchElement.alt = "loss";
        }
        standingsHome.querySelector(".lastfivematches").appendChild(matchElement);
    }

    // Append the clone to the container
    standings_home_container.appendChild(standingsHome);
}

getStandings();
