import { Router } from "express";
import DbProductManager from "../dao/mongodb/db.ProductManager.js";
import DbMessagesManager from "../dao/mongodb/db.MessagesManager.js";
import { authAdmin, authUser, authPremium } from "../auth/authentication.js";
import { validateMailTime } from "../controllers/session.controller.js";

const router = Router();
const dbProductManager = new DbProductManager();
const dbMessagesManager = new DbMessagesManager();

router.use((req, res, next) => {
  next();
});

router.get("/login", (req, res) => {
  return res.status(200).render("login", { style: "style.css" });
});

router.get("/restorepassword/:email/:date", (req, res) => {
  const reqemail = req.params.email;
  const requestDate = new Date(req.params.date);

  if (!reqemail || !requestDate) {
    return res
      .status(200)
      .render("requestresetpassword", { style: "style.css" });
  }

  const result = validateMailTime(requestDate);

  if (result) {
    return res
      .status(200)
      .render("resetpassword", { reqemail, style: "style.css" });
  }

  return res.status(200).render("requestresetpassword", { style: "style.css" });
});

router.get("/register", (req, res) => {
  return res.status(200).render("register", { style: "style.css" });
});

router.get("/resetpassword", (req, res) => {
  return res.status(200).render("requestresetpassword", { style: "style.css" });
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
  const _limit = +req.query.limit || 10;
  const _page = +req.query.page || 1;
  const _query = req.query.query || null;
  const _sort = +req.query.sort || null;

  try {
    const products = await dbProductManager.getProducts(
      _limit,
      _page,
      _query,
      _sort
    );
    products.payload = products.payload.map((doc) => doc.toObject());
    return res.status(200).render("home", { products, style: "style.css" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ status: "error", error: "Error al obtener los productos" });
  }
});

router.get("/products/realtimeproducts", authPremium, async (req, res) => {
  try {
    return res.status(200).render("realTimeProducts", { style: "style.css" });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send({ status: "error", error: "Error al obtener los productos" });
  }
});

router.get("/cart", authUser, async (req, res) => {
  try {
    return res.render("cart", { style: "style.css" });
  } catch (error) {
    console.error(error);
  }
});

router.get("/admin", authPremium, async (req, res) => {
  try {
    return res.render("addproduct", { style: "style.css" });
  } catch (error) {
    console.error(error);
  }
});

export default router;
