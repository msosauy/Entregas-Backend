import { Server } from "socket.io";
import ProductManager from "./ProductManager";

const productManager = new ProductManager("./src/products.json");

export default class SocketManager {
  constructor(server) {
    this.io = new Server(server);
    this.io.on("connection", async () => {
      console.log("Nuevo cliente conectado");
    });
    this.emitBroadcastProducts()
  }

  emitBroadcastProducts = async () => {
    const products = await productManager.getProducts();
    this.io.emit("realTimeProducts", products);
  };
}
