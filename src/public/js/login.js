const form = document.getElementById("loginForm");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  fetch("/cookie", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    console.log(result.status);
    if (result.status === 200) {
      window.location.replace("/profile");
    }
  });
});
