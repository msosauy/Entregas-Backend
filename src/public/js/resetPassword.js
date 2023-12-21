const form = document.getElementById("restorePass");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  try {
    fetch("/session/updatepassword", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        }
        if (data.success) {
          alert("Contraseña actualizada correctamente");
          window.location.replace("/views/login");
        }
      });
  } catch (error) {
    console.error("resetPassword.js", error);
  }
});
