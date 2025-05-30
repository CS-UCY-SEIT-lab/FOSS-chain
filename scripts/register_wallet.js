import { ethers } from "https://cdn.skypack.dev/ethers@5.7.2";

document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");
  const errorMessageDiv = document.getElementById("error-message");

  registrationForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(registrationForm);
    const password = registrationForm.querySelector("#password").value;
    const confirmPassword =
      registrationForm.querySelector("#confirm_password").value;

    if (password !== confirmPassword) {
      errorMessageDiv.textContent = "Passwords do not match.";
      errorMessageDiv.style.display = "block";
      return;
    }

    try {
      const wallet = ethers.Wallet.createRandom();
      console.log("Generated Wallet:", wallet);
      formData.append("wallet_address", wallet.address);

      // For demonstration purposes: store the private key in localStorage or send it to the backend
      // This is not secure, but for demonstration purposes, we will proceed this way.

      formData.append("private_key", wallet.privateKey); //This should not happen!!!
      const response = await fetch("/ade/PHP/register.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        window.location.href = "/ade/HTML/log-in.html";
      } else {
        errorMessageDiv.textContent = data.message;
        errorMessageDiv.style.display = "block";
      }
    } catch (error) {
      console.error("Error during wallet generation or registration:", error);
      errorMessageDiv.textContent = "An error occurred during registration.";
      errorMessageDiv.style.display = "block";
    }
  });
});
