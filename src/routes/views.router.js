import { Router } from "express";
import DbProductManager from "../dao/db.ProductManager.js";
import DbMessagesManager from "../dao/db.MessagesManager.js";
import { authAdmin, authUser } from "../auth/authentication.js";

const router = Router();
const dbProductManager = new DbProductManager();
const dbMessagesManager = new DbMessagesManager();

router.use((req, res, next) => {
  next();
});

router.get("/login", (req, res) => {
  return res.status(200).render("login", { style: "style.css" });
});

router.get("/register", (req, res) => {
  return res.status(200).render("register", { style: "style.css" });
});

router.get("/resetpassword", (req, res) => {
  return res.status(200).render("resetpassword", { style: "style.css" });
});

router.get("/chat", authUser, async (req, res) => {
  try {
    const data = await dbMessagesManager.getMessages();
    return res.status(200).render("chat", { data, style: "style.css" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .render({ status: "error", error: "Error al obtener los mensajes" });
  }
});

router.get("/products", authUser, async (req, res) => {
  try {
    const products = await dbProductManager.getProducts();
    products.payload = products.payload.map((doc) => doc.toObject());
    return res.status(200).render("home", { products, style: "style.css" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ status: "error", error: "Error al obtener los productos" });
  }
});

router.get("/products/realtimeproducts", authAdmin, async (req, res) => {
  try {
    return res.status(200).render("realTimeProducts", { style: "style.css" });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send({ status: "error", error: "Error al obtener los productos" });
  }
});

export default router;
