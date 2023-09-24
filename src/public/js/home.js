const socket = window.io();

socket.on("realTimeProducts", (products) => {
  console.log(products);
  const userLog = document.getElementById("userLog");
  const list = document.getElementById("list");
  const pagination = document.getElementById("pagination");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }

  let userInfo = "";
  let productList = "";
  let paginationList = "";

  try {
    fetch("");
  } catch (error) {
    console.error("home.js", error);
  }
  
  products.docs.forEach((el) => {
    productList = productList + `<li>${el.title} - U$S ${el.price}</li>`;
  });

  list.innerHTML = productList;
  pagination.innerHTML = paginationList;
});
