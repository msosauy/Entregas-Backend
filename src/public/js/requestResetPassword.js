const form = document.getElementById("restorePass");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  
  try {
    fetch("/session/requestrestorepassword", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(`Error: ${data.error} | Causa: ${data.cause}`);
        }
        if (data.success) {
          alert(data.success);
        }
      });
  } catch (error) {
    console.error(error);
  }
});
