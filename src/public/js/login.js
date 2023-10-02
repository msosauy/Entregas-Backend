const form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  try {
    fetch("/session/login", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          window.location.replace("/views/products");
        }
        if (data.status === "error") {
          alert(data.error);
        }
      });
  } catch (error) {
    console.log("login.js", error);
  }
});
