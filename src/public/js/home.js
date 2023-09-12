const socket = window.io();

socket.on("realTimeProducts", (products) => {
  const list = document.getElementById("list");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  let productList = "";

  products.forEach((el) => {
    productList = productList + `<li>${el.title} - U$S ${el.price}</li>`;
  });

  list.innerHTML = productList;
});
