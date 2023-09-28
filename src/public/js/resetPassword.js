const form = document.getElementById("restorePass");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  try {
    fetch("/session/restorepassword", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
    .then((data) => {
        console.log("resetPassword.js", data);
        if (data.status === "success" && data.success === "Clave restablecida correctamente") {
            alert(data.success)
            window.location.replace("/views/login")
        }
        if(data.status === "error") {
            alert(data.error)
        }
    });
  } catch (error) {
    console.error("resetPassword.js", error);
  }
});
