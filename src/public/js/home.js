//User info
const userLogin = document.getElementById("userLogin");
try {
  fetch("/session/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let userInfo = `<h2> Nombre: ${data.user.first_name} - Email: ${data.user.email} - Edad: ${data.user.age} - ROL: ${data.user.admin? "Administrador" : "Usuario"}</h2>`;
      userLogin.innerHTML = userInfo;
    });
} catch (error) {
  console.error("home.js", error);
}

//LOGOUT
const logout = document.getElementById("logout");

logout.addEventListener("click", () => {
  fetch("/session/logout", {
    method: "GET",
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace("/views/login");
    }
  });
})
