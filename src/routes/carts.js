import { Router } from "express";
import CartManager from "./../CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/carts.json");

router.use((req, res, next) => {
  next();
});

router.get("/:cid", async (req, res) => {
  const cid = +req.params.cid;
  try {
    const searchCartProducts = await cartManager.getProductsFromCartId(cid);
    return res.status(200).send(searchCartProducts);
  } catch (error) {
    if (error.message === "El carrito no existe") {
      return res
        .status(204)
        .send({ status: "error", error: "El carrito no existe" });
    }
    res.status(500).send({ status: "error", error: "Algo no salió bien" });
  }
});

//Crea un nuevo carrito con ID autogenerado
router.post("/", async (req, res) => {
  try {
    const newCartId = await cartManager.newCart();
    res.status(200).send({
      status: "success",
      success: `Nuevo carrito creado correctamente, ID: ${newCartId}`,
    });
  } catch (error) {
    if (error.message === "No se pudo crear el carrito") {
      return res
        .status(500)
        .send({ status: "error", error: "No se pudo crear el nuevo carrito" });
    }
    return res.status(500).send({ status: "error", error: "Algo salió mal" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const searchCid = +req.params.cid;
  const searchPid = +req.params.pid;

  try {
    await cartManager.addProductToCart(searchCid, searchPid);
    const result = await cartManager.getCarts();
    res
      .status(201)
      .send({
        status: "success",
        success: "Producto agregado correctamente",
        carts: result,
      });
  } catch (error) {
    if (error.message === "El carrito no existe") {
      return res.status(404).send({
        status: "error",
        error: "El carrito no existe",
      });
    }
    res.status(500).send({
      status: "error",
      error: "No se pudo crear o agregar el producto",
    });
  }
});

export default router;
