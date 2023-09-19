//EMITE en realTimeProducts, newUserConnected, messageLogs
//ESCUCHA en addProduct, error, message, removeById, authenticated

import DbProductManager from "../dao/db.ProductManager.js";
import DbMessageManager from "../dao/db.MessagesManager.js";

const dbProductManager = new DbProductManager();
const dbMessageManager = new DbMessageManager();

let _io;

export const SoketHandler = (io) => {
  _io = io;
  _io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    await emitProducts();
    await emitMessages();
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
        code,
      } = newProduct;
      try {
        await dbProductManager.addProduct(
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
          return;
        }
        console.log(error);
        return;
      }
      await emitProducts();
    });

    //Elimina un producto por ID
    socket.on("removeById", async (removeId) => {
      try {
        await dbProductManager.deleteProduct(removeId);
        await emitProducts();
      } catch (error) {
        if (error.message === "El articulo no existe") {
          socket.emit("error", "El articulo no existe");
        }
        console.error(error);
        return;
      }
    });

    //Agrega un nuevo mensaje a la BBDD y emite todos los mensajes para todos
    socket.on("message", async (message) => {
      try {
        await dbMessageManager.addMessage(message);
        emitMessages();
      } catch (error) {
        console.log(error);
        return;
      }
    });

    socket.on("authenticated", (user) => {
      console.log("works");
      socket.broadcast.emit("newUserConnected", user);
    });
  });
};

export const emitProducts = async () => {
  const products = await dbProductManager.getProducts();
  _io?.emit("realTimeProducts", products);
};

export const emitMessages = async () => {
  const messages = await dbMessageManager.getMessages();
  _io?.emit("messageLogs", messages);
};
