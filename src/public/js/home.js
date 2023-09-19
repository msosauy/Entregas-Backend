const socket = window.io();

socket.on("realTimeProducts", (products) => {
  console.log(products);
  const list = document.getElementById("list");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  let productList = "";

  products.docs.forEach((el) => {
    productList = productList + `<li>${el.title} - U$S ${el.price}</li>`;
  });

  list.innerHTML = productList;
});
