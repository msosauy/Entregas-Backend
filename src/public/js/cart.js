fetch("/api/carts/1/purchase", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  //   authorization: `Bearer ${data.token}`,
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data.data.orderProducts);
    let purchaseData = document.getElementById("purchaseData");
    let list = document.getElementById("ulProducts");
    let listNoStock = document.getElementById("ulNoStockProducts");
    let returnList = "";
    let returnListNoStock = "";

    purchaseData.innerHTML = `${data.data.ticketData.code} | ${data.data.ticketData.purchaser} | U$S ${data.data.ticketData.amount}`;

    data.data.orderProducts.forEach((el) => {
      returnList =
        returnList +
        `<li>${el.code} - ${el.title} - ${el.price} - ${el.quantity}</li>`;
    });

    list.innerHTML = returnList;

    data.data.outOfStock.forEach((el) => {
      returnListNoStock =
        returnListNoStock +
        `<li>${el.code} - ${el.title} - ${el.price} - ${el.quantity}</li>`;
    });
    listNoStock.innerHTML = returnListNoStock ;;
  });
