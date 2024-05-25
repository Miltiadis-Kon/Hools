
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
  const response = await fetch(model + "/clubs");
  const data = await response.json();
  //console.log(data);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (!data) {
    throw new Error("No data found");
  }
  console.log(data);
  //Get favourite clubs
  let favClubs = [];
  //TODO: Get the user's favorite clubs and add onclick to favorite club if logged in
  if(isLoggedInGlobal)
    {
      const userID = getCookie("email");
      const getClubsRequest = await fetch(model + `/users/getuser/${userID}`);
      if(!getClubsRequest.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const getClubsResponse = await getClubsRequest.json();
      if(!getClubsResponse)throw new Error("No data found");
      favClubs = getClubsResponse.user.clubs;
    }
  //Loop through the data and display it on the page
  let i = 0;
  data.clubs.map(async (team) => {
    if (isNaN(parseInt(team.footballAPI_id))) {
      throw new Error("Invalid data");
    } 
    if (i > 3) return;
    i++;
    const clubHome = club_home_template.content.cloneNode(true);
    clubHome.querySelector("[club-name]").textContent = team.name;
    var img = clubHome.querySelector("[club-image] img");
    img.src = team.logo;
    img.alt = team.name;
    var alt = clubHome.querySelector("[club-image]  a");
    alt.href = `team.html?club=${team.footballAPI_id}`;
    club_home_container.appendChild(clubHome);

    // Add heart icon if user is logged in
    if(isLoggedInGlobal && favClubs.includes(team.footballAPI_id) )
      {
        clubHome
        .querySelector("#favoriteClub")
        .querySelector("#imgHeart")
        .classList.add("active");
    clubHome
      .querySelector("#favoriteClub")
      .addEventListener("click", async (e) => {
        const parent = e.target.parentElement;
        let favClub = parent.querySelector("#imgHeart");
        //Check if user is signed in
        if (isLoggedInGlobal) {
          //check if club is 
        }
      });
    }
    return { name: team.name, logo: team.logo };
  });
};

getTeams();
