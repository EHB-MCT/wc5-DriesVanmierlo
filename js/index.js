"use strict";

const messageSystem = {
  startFetching() {
    setInterval(this.fetchMessages, 3000);
    //console.log(this.startFetching);
  },

  sendMessage(msg) {
    // https://thecrew.cc/api/message/create.php?token=__TOKEN__ POST
    fetch(`https://thecrew.cc/api/message/create.php?token=${userSystem.token}`, {
        method: "POST",
        body: JSON.stringify({
          message: msg
        })
      })
      .then((response) => {
        return response.json();
      });
  },

  fetchMessages() {
    console.log("Fetch!");
    fetch(`https://thecrew.cc/api/message/read.php?token=${userSystem.token}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const output = document.getElementById("output");
        let htmlString = "";
        data.forEach((message) => {
          htmlString += `<div id="output">
          <div class="message">
            <span class="by">${message.handle}</span>
            <span class="on">${message.created_at}</span>
            <p>${message.message}</p>
          </div>`;
        });

        output.innerHTML = htmlString;
      });
    //const output = document.getElementById('output');
    //output.insertAdjacentHTML('beforeend', htmlString);
  }
};

// https://thecrew.cc/api/message/read.php?token=__TOKEN__ GET

const userSystem = {
  token: "",
  loggedIn: false,

  saveToken() {
    localStorage.setItem("token", this.token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  logout() {
    localStorage.removeItem("token");
    this.updateUser();
  },

  login(email, password) {
    fetch("https://thecrew.cc/api/user/login.php", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.token);
        this.token = data.token;
        this.saveToken();
        document.getElementById("loginWindow").style.display = "none";
      });
  },

  updateUser(password, handle) {
    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
    fetch(`https://thecrew.cc/api/user/update.php?token=${userSystem.token}`, {
        method: "POST",
        body: JSON.stringify({
          password: password,
          handle: handle
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.token);
        this.token = data.token;
        this.saveToken();
        document.getElementById("loginWindow").style.display = "none";
      });
  }
};

const display = {
  initFields() {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", this.submitHandler);

    const messageForm = document.getElementById("messageForm");
    messageForm.addEventListener("submit", this.submitMessage);

    const logoutButton = document.getElementById("logoutBtn");
    logoutButton.addEventListener('click', userSystem.logout);
  },

  submitHandler(e) {
    e.preventDefault("submit");
    let loginEmail = document.getElementById("emailField").value;
    let loginPassword = document.getElementById("passwordField").value;
    console.log(loginEmail, loginPassword);
    userSystem.login(loginEmail, loginPassword);
    messageSystem.startFetching();
  },

  submitMessage(e) {
    e.preventDefault("submit");
    let messageText = document.getElementById("messageField").value;
    console.log(messageText);
    messageSystem.sendMessage(messageText);
  },

  render() {
    console.log("render");
    const tokenVar = userSystem.getToken();
    if (tokenVar) {
      console.log("logged in");
      document.getElementById("loginWindow").style.display = "none";
      messageSystem.startFetching();
    } else {
      console.log("not logged in");
    }
  },
  renderMessages() {}
};

display.initFields();