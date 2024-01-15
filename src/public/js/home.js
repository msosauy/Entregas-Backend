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
      let userInfo = `<h2> Nombre: ${data.user.first_name} - Email: ${
        data.user.email
      } - Edad: ${data.user.age} - ROL: ${
        data.user.admin ? "Administrador" : "Usuario"
      }</h2>`;
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
});

//ADD product to cart
let buttons = document.querySelectorAll('button[id^="addToCart-"]');

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const productId = button.dataset.id;
    let cartId;

    fetch("/api/carts/getcartfromuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        cartId = data.payload.cartId;

        fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.success);
          });
      });
  });
});
