const socket = window.io();

const userLogin = document.getElementById("userLogin");
fetch("/session/profile", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    let userInfo = `<h2>Nombre: ${data.user.first_name} - Email: ${data.user.email} - Edad: ${data.user.age}</h2>`;
    userLogin.innerHTML = userInfo;
  });

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

socket.on("error", (errorMessage) => {
  alert(errorMessage);
});

socket.on("realTimeProducts", (products) => {
  let list = document.getElementById("ulProducts");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  let returnList = "";

  products.payload.forEach((el) => {
    returnList =
      returnList +
      `<li>${el.id} ${el.title} - U$S ${el.price} - ${el.code}</li>`;
  });

  list.innerHTML = returnList;
  returnList = "";
});

//agregar un nuevo producto
document.getElementById("addProduct").addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const status = document.getElementById("status").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const thumbnails = document.getElementById("thumbnails").value;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category ||
    !thumbnails
  ) {
    return alert("Flatan datos requeridos");
  }

  const newProduct = {
    title,
    description,
    code,
    price: parseInt(price),
    status,
    stock: parseInt(stock),
    category,
    thumbnails,
  };

  fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "error") {
          alert(data.error);
      }

      if (data.status === "success") {
        alert(data.success);
      }
    })
    .catch((error) => {
      console.error("realTimeProducts.js_catch_01", error);
    });
});

//eliminar un producto
document.getElementById("removeProduct").addEventListener("click", () => {
  const removeId = document.getElementById("removeId").value;
  socket.emit("removeById", parseInt(removeId));
});
