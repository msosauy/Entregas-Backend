const base = `
                <h1>Compra finalizada</h1>
                <p>Hemos enviado esta órden a su mail...</p>
                <p id="purchaseData"></p>
                <h2>Lista de productos</h2>
                <ul id="ulProducts"></ul>
                <h3>Productos sin stock disponible</h3>
                <ul id="ulNoStockProducts"></ul>`;

const baseCart = `
                <h1>Carrito</h1>
              <h2>Lista de productos</h2>
              <ul id="ulProducts"></ul>
              <p id="totalAmount"></p>
              <div id="buyButton"></div>
              <button id="buy">COMPRAR</button>`;

let cart_id;
const cart = document.getElementById("cart");
const purchase = document.getElementById("purchase");
const removeCart = document.getElementById("removeCart");

removeCart.addEventListener("click", async () => {
  fetch(`/api/carts/${cart_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      cart.remove();
      g = document.createElement('div');
      g.id = "cart";
      cart.innerHTML = baseCart;
    })
    .catch((error) => {
      console.error(error);
    });
}
);

document.getElementById("buy").addEventListener("click", async () => {
  cart.remove(); //removemos toda la info del carrito
  purchase.innerHTML = base; //agregamos la nueva estructura del carrito

  fetch(`/api/carts/${cart_id}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
      listNoStock.innerHTML = returnListNoStock;
    })
    .catch((error) => {
      console.error(error);
    });
});

//Obtenemos la información necesaria para mostrar los productos en el carrito y para cerrar la compra
fetch("/api/carts/getcartfromuser", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((response) => response.json())
  .then((data) => {
    cart_id = data.payload.cartId;
    let productsList = document.getElementById("ulProducts");
    let totalAmount = document.getElementById("totalAmount");

    let returnList = "";

    data.payload.orderProducts.forEach((el) => {
      returnList =
        returnList +
        `<li>${el.code} - ${el.title} - U$S ${el.price} - Cant: ${el.quantity}</li>`;
    });

    productsList.innerHTML = returnList;
    totalAmount.innerHTML = `TOTAL: U$S ${data.payload.totalAmount}`;
  })
  .catch((error) => {
    console.error(error);
  });
