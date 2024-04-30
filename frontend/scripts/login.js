const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

const signin_form = document.getElementById('.form-container sign-in');
const signup_form = document.querySelector('.form-container sign-up');

registerBtn.addEventListener('click', async () => {
    container.classList.add("active");
     //TODO: Add signup functionality

    //Get user name, email, password
    const username = signup_form.querySelector('input[placeholder="Name"]').value;
    const email = signup_form.querySelector('input[placeholder="Email"]').value;
    const password = signup_form.querySelector('input[placeholder="Password"]').value;
    //Check if user name does not exist
    let check_name = await fetch(`http://localhost:5000/users/${username}`);
    let data_name = await check_name.json();
    if (!check_name.ok) {
        throw new Error(`HTTP error! status: ${check_name.status}`);
    }
    if (!data_name) {
        throw new Error("No data found");
    }

    //check if email does not exist
    let check_email = await fetch(`http://localhost:5000/users/${email}`);
    let data_mail = await response.json();
    if (!check_email.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!data_mail) {
        throw new Error("No data found");
    }
    //Add user to database
    let response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });
    
    //login user

    
    //Redirect to home page
    
});

loginBtn.addEventListener('click', async () => {
    container.classList.remove("active");
    const username = signin_form.querySelector('input[placeholder="Name"]').value;
    const password = signin_form.querySelector('input[placeholder="Password"]').value;
    //check if user exists
    let response = await fetch(`http://localhost:5000/users/${username}`);
    let data = await response.json();
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!data) {
        throw new Error("No data found");
    }
    //check if password is correct
    if (data.password !== password) {
        throw new Error("Incorrect password");
    }
    //login 
    
    //Redirect to home page
    // login user
    
    // Redirect to home page
    window.location.href = "/";
});