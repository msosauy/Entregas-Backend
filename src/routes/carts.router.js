import { Router } from "express";
import DbCartManager from "../dao/db.CartManager.js";

const router = Router();
const dbcartManager = new DbCartManager();

router.use((req, res, next) => {
  next();
});
//Devuelve todos los productos de un carrito según su ID
router.get("/:cid", async (req, res) => {
  const cid = +req.params.cid;
  try {
    const searchCartProducts = await dbcartManager.getProductsFromCartId(cid);
    console.log(searchCartProducts);
    return res.status(200).send(searchCartProducts.products);
  } catch (error) {
    if (error.message === "El carrito no existe") {
      return res
        .status(404)
        .send({ status: "error", error: "El carrito no existe" });
    }
    res.status(500).send({ status: "error", error: "Algo no salió bien" });
  }
});

//Crea un nuevo carrito con ID autogenerado
router.post("/", async (req, res) => {
  try {
    const newCartId = await dbcartManager.newCart();
    return res.status(200).send({
      status: "success",
      success: `Nuevo carrito creado correctamente, ID: ${newCartId[0].id}`,
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

//Agrega el producto indicado por ID, al carrito indicado por ID
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = +req.params.cid;
  const productId = +req.params.pid;

  try {
    const resultAdd = await dbcartManager.addProductToCart(cartId, productId);
    console.log("router", resultAdd);
    if (resultAdd.matchedCount === 1) {
      const resultGet = await dbcartManager.getCarts();
      return res.status(201).send({
        status: "success",
        success: "Producto agregado correctamente",
        carts: resultGet,
      });
    }
    return res.status(404).send({
      status: "error",
      error: "El carrito no existe",
    });
  } catch (error) {
    console.log(error);
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
