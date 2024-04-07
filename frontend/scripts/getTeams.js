const club_home_template = document.querySelector("[club-home-template]");

const club_home_container = document.querySelector("[club-home-container]");

const search_input = document.querySelector("[search-input]");

search_input.addEventListener("input", (e) => {
    const search = e.target.value.toLowerCase();
    const clubs = club_home_container.querySelectorAll("[club-name]");
    clubs.forEach((club) => {
        const clubName = club.textContent.toLowerCase();
        if (clubName.includes(search)) {
            club.parentElement.style.display = "block";
        } else {
            club.parentElement.style.display = "none";
        }
    });
});

//Dummy data for testing
const data = {
    teams: [
        { name: "Olympiakos", logo: "https://en.wikipedia.org/wiki/File:Olympiacos_FC_logo.svg" },
        { name: "Panathinaikos", logo: "https://en.wikipedia.org/wiki/File:Panathinaikos_F.C._logo.svg" },
        { name: "AEK", logo: "https://en.wikipedia.org/wiki/File:AEK_Athens_FC_logo.svg" },
        { name: "PAOK", logo: "https://en.wikipedia.org/wiki/File:PAOK_emblem_2010.svg" },
    ]
};

const getTeams = () =>{
    console.log(data.teams);
    data.teams.map((team) => {
      const clubHome = club_home_template.content.cloneNode(true);
      clubHome.querySelector("[club-name]").textContent = team.name;
      var img = clubHome.querySelector("[club-image]");
        img.src = team.logo;
        img.alt = team.name;
      club_home_container.appendChild(clubHome);
      return { name: team.name, logo: team.logo}
    });
};

getTeams();
