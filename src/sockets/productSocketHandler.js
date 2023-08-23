import ProductManager from "../ProductManager.js";
const productManager = new ProductManager("./src/products.json");

let _io;

export const productSoketHandler = (io) => {
  _io = io;
  _io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    await emitProducts();
    //Agrega un nuevo producto y envía nuevamente la lista de productos al socket
    socket.on("addProduct", async (newProduct) => {
      const {
        title,
        description,
        price,
        thumbnails,
        stock,
        status,
        category,
        code
      } = newProduct;
      await productManager.addProduct(
        title,
        description,
        price,
        thumbnails,
        stock,
        status,
        category,
        code
      );
      await emitProducts();
    });
    
    socket.on("removeById", async (removeId) => {
      await productManager.deleteProduct(removeId);
      await emitProducts();
    });
  });
};

export const emitProducts = async () => {
  const products = await productManager.getProducts();
  _io?.emit("realTimeProducts", products);
};
