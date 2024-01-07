import { Router } from "express";
import { authUser, authAdmin, authPremium } from "../auth/authentication.js";
import { getProducts, getProductById, addProduct, updateProduct, deleteProductById, mockingProducts, getProductByCode } from "../controllers/products.controller.js";

const router = Router();

router.use((error, req, res, next) => {
  next();
});

//Devuelve todos los productos o la cantidad de productos indicada con query ?limit=number
router.get("/", authUser, getProducts);
// //Busca un producto por ID por params
router.get("/:pid", authUser, getProductById);
//Busca un producto por code por params
router.get("/code/:code", authPremium, getProductByCode);
//Mocking
router.get("/mockingproducts", mockingProducts);
//Agrega un nuevo producto
router.post("/", authPremium, addProduct);
// //Busca un producto por ID y lo modifica
router.put("/:pid", authPremium, updateProduct);
// //Elimina un producto según su ID
router.delete("/:pid", authPremium, deleteProductById);

export default router;