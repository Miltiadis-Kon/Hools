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
    console.log(data);
    //Loop through the data and display it on the page
    data.map((team) => {
        const clubHome = club_home_template.content.cloneNode(true);
        clubHome.querySelector("[club-name]").textContent = team.name;
        var img = clubHome.querySelector("[club-image]");
        img.src = team.logo;
        img.alt = team.name;
        clubHome.querySelector('#favoriteClub').addEventListener('click', heartClub);

        club_home_container.appendChild(clubHome);
        return { name: team.name, logo: team.logo };
    });
}

function heartClub(){
  let imgHeart = parent.querySelector('#imgHeart');
    imgHeart.classList.toggle("active");
    }

getTeams();
