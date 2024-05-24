//const model = "http://localhost:5000";
const model = "https://hools.onrender.com";


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


const checkName = async (username) => {
  //Check if user name is unique
  const checkuser = await fetch(model+`/users/checkname/${username}`);
  const user_data = await checkuser.json();
  if (!checkuser.ok) {
    throw new Error(`HTTP error! status: ${checkuser.status}`);
  }
  if (!user_data) {
    throw new Error("No data found");
  }
  if (user_data.answer === "true") {
    return true;
  } else {
    alert("Username already exists!");
    return false;
  }
}

const checkEmail = async (email) => {
  //Check if email is unique
  const checkmail = await fetch(model+`/users/checkmail/${email}`);
  const mail_data = await checkmail.json();
  if (!checkmail.ok) {
    throw new Error(`HTTP error! status: ${checkmail.status}`);
  }
  if (!mail_data) {
    throw new Error("No data found");
  }
  if (mail_data.answer === "true") {
    return true;
  }
  else {
    alert("Email already exists!");
    return false;
  }
}

const signupUser = async (username, email, password, isAdmin) => {
  //Create a custom ID for the user
  const id = Math.floor(Math.random() * 1000);
  let response = await fetch(model+"/users/createuser/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name:username, email:email,password:password,isAdmin:isAdmin,userID:id}),
  });
  let data = await response.json();

  console.log(data);
  console.log(response);
  if (!response.ok) {
    alert("User already exists!");
  } 
  else 
  {
    setCookie("username", username, 7);
    setCookie("userID", id, 7);
    setCookie("email", email, 7);
    window.location.href = "/frontend/";
  }
}

signupBtn.addEventListener("click", (event) => {
  event.preventDefault();
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
  checkName(username).then((name) => {
    if (name) {
      checkEmail(email).then((mail) => {
        if (mail) {
          signupUser(username, email, password, isAdmin);
        }
      });
    }
  });

});

//TODO:Fix login
const  loginUser = async (username, password) => {
  //Delete cookies
  setCookie("username", "", -1);
  setCookie("userID", "", -1);
  setCookie("email", "", -1);
  //check if user exists
  const response = await fetch(model+`/users/getuser/${username}`);
  const data = await response.json();
  if (!response.ok) {
    document.getElementById("wrong_mail").style.display = "flex";
    throw new Error(`HTTP error! status: ${response.status}`);
  }
    if (!data) {
      document.getElementById("wrong_mail").style.display = "flex";
    throw new Error("No data found");
    }
    //check if password is correct
    if (data.user.password !== password) {
      document.getElementById("wrong_mail").style.display = "none";
      document.getElementById("wrong_pass").style.display = "flex";
      throw new Error("Wrong password");
    }
    document.getElementById("wrong_pass").style.display = "none";
    console.log(data);
      setCookie("username", username, 7);
      setCookie("userID", data.user.userID, 7);
      setCookie("email", data.user.email, 7);
      window.location.href = "/frontend/";
  }

signinBtn.addEventListener("click",  (event) => {
  event.preventDefault();
  const username = signin_form.querySelector(
    'input[placeholder="Email"]'
  ).value;
  const password = signin_form.querySelector(
    'input[placeholder="Password"]'
  ).value;
  loginUser(username, password);
});



document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if(container.classList.contains("active"))
      {
        console.log("Sing up");
        signupBtn.click();

      }
    else 
    {
      console.log("Sign in");
      signinBtn.click();

    }
  }
});