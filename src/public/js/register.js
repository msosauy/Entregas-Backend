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
    .then((json) => {
      console.log(json);
      if ((json.status === "success", json.success === "User registered")) {
        alert("Usuario creado correctamente");
        window.location.replace("/views/login");
        return
      }
      if (json.status === "error" && json.error === "Ya existe usuario con ese email") {
        return alert(json.error);
      }
        alert("Intentalo de nuevo");
    });
});
