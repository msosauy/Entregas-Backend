const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/session/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((data) => {
      if (data.status === "success" && data.success === "Usuario registrado correctamente") {
        alert("Usuario creado correctamente");
        window.location.replace("/views/login");
        return
      }
      if (data.error) {
        alert(data.error)
        window.location.replace("/views/register");
        return
      }
        alert("Intentalo de nuevo");
        window.location.replace("/views/register");
        return
    });
});
