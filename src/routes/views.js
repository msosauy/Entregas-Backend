import { Router } from "express";
import ProductManager from "./../ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/products.json");

router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    return res.status(200).render("home", { products, style: "style.css" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .render({ status: "error", error: "Error al obtener los productos" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
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
