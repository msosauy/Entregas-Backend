//LOGIN
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

//ADD NEW PRODUCT
document.getElementById("addProduct").addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const _status = document.getElementById("status").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const file = document.getElementById("thumbnails").files[0];
  
  let status;

  if (_status === "on") {
    status = true;
  }

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category
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
  };

  const addNewProduct = await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(newProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const addNewProductData = await addNewProduct.json();

  if (addNewProductData.status === "error") {
    alert(data.error);
  }

  if (addNewProductData.status === "success") {
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/users/1/documents", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Producto agregado  correctamente");
        }
      });
  }
});
