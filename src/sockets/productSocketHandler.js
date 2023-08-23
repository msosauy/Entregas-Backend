import ProductManager from "../ProductManager.js";
const productManager = new ProductManager("./src/products.json");

let _io;

export const registerProductSoketHandler = (io) => {
  _io = io;
  _io.on("connection", async () => {
    console.log("Nuevo cliente conectado");
    await emitProducts();
  });
};

export const emitProducts = async () => {
  const products = await productManager.getProducts();
  _io?.emit("realTimeProducts", products);
};