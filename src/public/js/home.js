const getCartOrCreate = async () => {
  let _cartId;

  const getCart = await fetch("/api/carts/getcartfromuser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getCartData = await getCart.json();

  if (getCartData.error === "El carrito no existe") {
    const createCart = await fetch("/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const createCartData = await createCart.json();
    if (createCartData.success) {
      const getCartRetry = await fetch("/api/carts/getcartfromuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const getCartRetryData = await getCartRetry.json();
      _cartId = getCartRetryData.payload.cartId;
    }
  } else {
    _cartId = getCartData.payload.cartId;
  }
  return _cartId;
};

const addProductToCart = async (cartId, productId) => {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Producto agregado al carrito");
      } else {
        alert("Error al agregar el producto al carrito");
      }
    });
};
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
  button.addEventListener("click", async () => {
    const productId = button.dataset.id;
      const cartId = await getCartOrCreate();
      await addProductToCart(cartId, productId);
  });
});
