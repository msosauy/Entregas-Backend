const socket = window.io();

socket.on("realTimeProducts", (products) => {
  console.log(products);
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

  paginationList = `<a href=${products.}>${products.totalPages}</a>`

  list.innerHTML = productList;
  pagination.innerHTML = paginationList;
});
