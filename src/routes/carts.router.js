import { Router } from "express";
import DbCartManager from "../dao/db.CartManager.js";

const router = Router();
const dbcartManager = new DbCartManager();

router.use((req, res, next) => {
  next();
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

//Devuelve todos los productos de un carrito según su ID por params
router.get("/:cid", async (req, res) => {
  const cid = +req.params.cid;

  if (isNaN(cid)) {
    return res
      .status(400)
      .send({ status: "error", error: "/:cid debe ser un numero" });
  }

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

//Agrega el producto indicado por ID, al carrito indicado por ID
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = +req.params.cid;
  const productId = +req.params.pid;

  try {
    const resultAdd = await dbcartManager.addProductToCart(cartId, productId);

    return res.status(201).send({
      status: "success",
      success: "Producto agregado correctamente",
      cart: resultAdd,
    });
  } catch (error) {
    console.error(error);
    
    res.status(500).send({
      status: "error",
      error: "No se pudo agregar el producto",
    });
  }
});

export default router;
