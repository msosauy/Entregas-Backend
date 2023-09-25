import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import cookiesRouter from "./routes/cookies.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import { SoketHandler } from "./sockets/SocketHandler.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();
const PORT = 8080;

mongoose.connect(
  "mongodb+srv://msosa:OJ9bgeMIrDF7pkEV@cluster-coder.bxbohyn.mongodb.net/ecommerce",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://msosa:OJ9bgeMIrDF7pkEV@cluster-coder.bxbohyn.mongodb.net/ecommerce",
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15,
    }),
    secret: "coderhouse", //usuario al que se le genera la cookie session
    resave: true, // mantiene la sesión activa aunque no haya actividad
    saveUninitialized: true, //permite guardar la sesión aunque el objeto recibido no contenga nada
  })
);

app.use(cookieParser("ASDfghjkl098!lp")); // secret para firmar las cookies accedemos con req.signedCookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/views", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/session", sessionRouter);
app.use("/api/cookies", cookiesRouter);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Creamos una instancia del servidor en SocketHandler
const io = new Server(server);
SoketHandler(io);
