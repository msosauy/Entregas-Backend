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
      try {
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
      } catch (error) {
        if (error.message === "El codigo de producto ya existe") {
          socket.emit("error", "El codigo de producto ya existe");
        }
      }
      await emitProducts();
    });
    
    socket.on("removeById", async (removeId) => {
      try {
        await productManager.deleteProduct(removeId);
        await emitProducts();
      } catch (error) {
        if (error.message === "El articulo no existe") {
          socket.emit("error", "El articulo no existe");
        }
      }
    });
  });
};

export const emitProducts = async () => {
  const products = await productManager.getProducts();
  _io?.emit("realTimeProducts", products);
};
