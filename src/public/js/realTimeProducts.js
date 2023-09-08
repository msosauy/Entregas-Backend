const socket = window.io();

socket.on("error", (errorMessage) => {
  alert(errorMessage);
})

socket.on("realTimeProducts", (products) => {
  let list = document.getElementById("ulProducts");
  
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  let returnList = "";

  products.forEach((el) => {
    returnList = returnList + `<li>${el.id} ${el.title} - U$S ${el.price} - ${el.code}</li>`;
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

  socket.emit("addProduct", newProduct);
});

//eliminar un producto
document.getElementById("removeProduct").addEventListener("click", () => {
  const removeId = document.getElementById("removeId").value;

  socket.emit("removeById", parseInt(removeId));
});
