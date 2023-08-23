import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import { productSoketHandler } from "./sockets/productSocketHandler.js";

const app = express();

app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/views/products", viewsRouter);
app.use("/api/carts", cartsRouter);

const server = app.listen(8080, () => {
  console.log("Server running on port 8080");
});

//Creamos una instancia del servidor en productSocketHandler
const io = new Server(server);
productSoketHandler(io);