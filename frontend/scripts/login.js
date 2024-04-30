const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

const signinBtn = document.getElementById("sign-in btn");
const signupBtn = document.getElementById("sign-up btn");
const signin_form = document.querySelector(".sign-in");
const signup_form = document.querySelector(".sign-up");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

signupBtn.addEventListener("click", async () => {
  console.log("SIGN UP");
  //TODO: Add signup functionality

  //Get user name, email, password
  const username = signup_form.querySelector('input[placeholder="Name"]').value;
  const email = signup_form.querySelector('input[placeholder="Email"]').value;
  const password = signup_form.querySelector(
    'input[placeholder="Password"]'
  ).value;
  const admin = signup_form.querySelector('input[id="agree"]').value;
  let isAdmin = false;
    if (admin === "on") { isAdmin = true; }
    else { isAdmin = false; }
  console.log(username + " " + email + " " + password + " " + admin);
  var nameCheck = false;
  var mailCheck = false;
  //Check if user name does not exist
  let check_name = await fetch(`http://localhost:5000/users/${username}`);
  if (!check_name.ok) {
    nameCheck = true;
  }
  //check if email does not exist
  let check_email = await fetch(`http://localhost:5000/users/${email}`);
  if (!check_email.ok) {
    mailCheck = true;
  }
  //Add user to database
  if (nameCheck && mailCheck) {
    let response = await fetch("http://localhost:5000/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password,isAdmin }),
    });
    let data = await response.json();
    console.log(data);
    console.log(response);
    if (!response.ok) {
      alert("User already exists!");
    } 
    else 
    {
      alert("User created successfully!");
    }
  }
      //TODO:login
      // login user

      // Redirect to home page
});

signinBtn.addEventListener("click", async () => {
  console.log("LOG IN");
  console.log(signin_form);
  const username = signin_form.querySelector(
    'input[placeholder="Email"]'
  ).value;
  const password = signin_form.querySelector(
    'input[placeholder="Password"]'
  ).value;
  //check if user exists
  let response = await fetch(`http://localhost:5000/users/${username}`);
  let data = await response.json();
  console.log(response);
  if (!response.ok) {
    alert("User does not exist!");
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    if (!data) {
      alert("No user found");
      throw new Error("No data found");
    }
    //check if password is correct
    if (data.password !== password) {
      alert("Incorrect password");
      throw new Error("Incorrect password");
    } else {
      alert("Logged in successfully!");
      //TODO:login
      // login user

      // Redirect to home page
      window.location.href = "/";
    }
  }
});
