document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginButton");
  const messageContainer = document.getElementById("messageContainer");

  loginButton.addEventListener("click", function (event) {
    window.location.href = "/HTML/main-portal1.html";
  });
  //dont need this anymore, log in handled in php (check later to del)
});
