const form = document.getElementById("registerForm");

const validate = (json) => {
  console.log(json);
  if ((json.status === "success", json.message === "User registered")) {
    alert("Usuario creado correctamente");
    window.location.replace("/views/login");
  } else {
    alert("Intentalo de nuevo");
    window.location.replace("/views/register");
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => validate(json));
});
