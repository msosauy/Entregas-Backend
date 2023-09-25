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
    let userInfo = `<h2>Nombre: ${data.user.name} - Email: ${data.user.email} - Edad: ${data.user.age}</h2>`;
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

socket.on("realTimeProducts", (products) => {
  const list = document.getElementById("list");
  const pagination = document.getElementById("pagination");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }


  let productList = "";
  let paginationList = "";

  products.docs.forEach((el) => {
    productList = productList + `<li>${el.title} - U$S ${el.price}</li>`;
  });

  list.innerHTML = productList;
  pagination.innerHTML = paginationList;
});
