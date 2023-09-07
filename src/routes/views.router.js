import { Router } from "express";
import DbProductManager from "../dao/db.ProductManager.js";
import DbMessagesManager from "../dao/db.MessagesManager.js";

const router = Router();
const dbProductManager = new DbProductManager();
const dbMessagesManager = new DbMessagesManager();

router.use((req, res, next) => {
  next();
});

router.get("/chat", async (req, res) => {
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

router.get("/products", async (req, res) => {
  try {
    const products = await dbProductManager.getProducts();
    return res.status(200).render("home", { products, style: "style.css" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .render({ status: "error", error: "Error al obtener los productos" });
  }
});

router.get("/products/realtimeproducts", async (req, res) => {
  try {
    return res.status(200).render("realTimeProducts", { style: "style.css" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .render({ status: "error", error: "Error al obtener los productos" });
  }
});

export default router;
