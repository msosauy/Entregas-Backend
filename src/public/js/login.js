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
      .then((response) => {
        if (response.status == 404) {
          alert("Credenicales invalidas")
        }
        (response) => response.json()
      })
      .then((data) => {
        if (
          data.status === "success" &&
          data.success === "Logueado correctamente"
        ) {
          fetch("/api/cookies/setcookie/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${data.token}`,
            },
          }).then(
            setTimeout(() => {
              window.location.replace("/views/products");
              // window.location.replace("/session/current");
            }, "300")
          );
        }
        if (data.status === "error") {
          alert(data.error);
          window.location.replace("/views/login");
        }
      });
  } catch (error) {
    console.log("login.js", error);
  }
});
