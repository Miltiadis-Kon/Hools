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

//Function to get the data from the DB
const getTeams = async () => {
  const response = await fetch("http://localhost:5000/clubs");
  const data = await response.json();
  //console.log(data);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  //Loop through the data and display it on the page
  data.clubs.map((team) => {
    const clubHome = club_home_template.content.cloneNode(true);
    clubHome.querySelector("[club-name]").textContent = team.name;
    var img = clubHome.querySelector("[club-image]");
    img.src = team.logo;
    img.alt = team.name;
    clubHome
      .querySelector("#favoriteClub")
      .addEventListener("click", async (e) => {
        const parent = e.target.parentElement;
        let favClub = parent.querySelector("#imgHeart");
        //TODO: fix this
        const res = fetch("http://localhost:5000/users/clubs/", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: "user_id",
            club: team.name,
          }),
        });
        if (favClub.classList.contains("active")) {
          favClub.classList.remove("active");
        } else {
          favClub.classList.add("active");
        }
      });

    club_home_container.appendChild(clubHome);
    return { name: team.name, logo: team.logo };
  });
};

getTeams();
