fetch("/api/carts/getcartfromuser", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((response) => response.json())
  .then((data) => {
    let productsList = document.getElementById("ulProducts");
    let totalAmount = document.getElementById("totalAmount");

    let returnList = "";

    data.payload.orderProducts.forEach((el) => {
      returnList =
        returnList + `<li>${el.code} - ${el.title} - U$S ${el.price} - Cant: ${el.quantity}</li>`;
    });

    productsList.innerHTML = returnList;
    totalAmount.innerHTML = `TOTAL: U$S ${data.payload.totalAmount}`;
  })
  .catch((error) => {
    console.error(error);
  });
