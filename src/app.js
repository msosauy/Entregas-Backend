import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import userRouter from "./routes/users.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js";
import cookiesRouter from "./routes/cookies.router.js";
import loggerRouter from "./routes/loggerTest.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import { SoketHandler } from "./sockets/SocketHandler.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import env from "./config/enviroment.config.js";
import { addLogger } from "./middlewares/logging/logger.js";

const app = express();
const PORT = env.port;
const mongoDbUrl = env.mongo_url;
const cookieSecret = env.cookie_secret;

app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoDbUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
    secret: "coderhouse", //usuario al que se le genera la cookie session
    resave: true, // mantiene la sesión activa aunque no haya actividad
    saveUninitialized: true, //permite guardar la sesión aunque el objeto recibido no contenga nada
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser(cookieSecret)); // secret para firmar las cookies accedemos con req.signedCookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(addLogger);

app.use("/api/products", productsRouter);
app.use("/views", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/session", sessionRouter);
app.use("/api/cookies", cookiesRouter);
app.use("/loggertest", loggerRouter);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Creamos una instancia del servidor en SocketHandler
const io = new Server(server);
SoketHandler(io);
