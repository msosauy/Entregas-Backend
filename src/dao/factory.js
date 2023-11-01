import mongoose from "mongoose";
import config from "../config/enviroment.config.js"; 

export let Products;
export let Carts;
export let Messages;

switch (config.persistence) {
    case "MONGO":
        console.log("Persistencia seleccionada: MONGODB");
        const connect = mongoose.connect(config.mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const {default: DbProductManager} = await import("./mongodb/db.ProductManager.js");
        const {default: DbCartManager} = await import("./mongodb/db.CartManager.js");
        const {default: DbMessageManager} = await import("./mongodb/db.MessagesManager.js");
        Products = DbProductManager;
        Carts = DbCartManager;
        Messages = DbMessageManager;
        break;
    case "MEMORY":
        console.log("Persistencia seleccionada: MEMORY");
        const {default: ProductManager} = await import("./memory/fs.ProductManager.js");
        const {default: CartManager} = await import("./memory/fs.CartManager.js");
        Products = ProductManager;
        Carts = CartManager;
        break;
    default:
        console.error("Factory.js: Se debe indicar a través de un archivo .env la persistencia a utilizar");
        break;
}