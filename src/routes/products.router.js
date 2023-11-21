import { Router } from "express";
import { authUser, authAdmin } from "../auth/authentication.js";
import { getProducts, getProductById, addProduct, updateProduct, deleteProductById, mockingProducts } from "../controllers/products.controller.js";

const router = Router();

router.use((req, res, next) => {
  next();
});
//Devuelve todos los productos o la cantidad de productos indicada con query ?limit=number
router.get("/", authUser, getProducts);
//Mocking
router.get("/mockingproducts", mockingProducts);
// //Busca un producto por ID por params
router.get("/:pid", authUser, getProductById);
// //Agrega un nuevo producto
router.post("/", authAdmin, addProduct);
// //Busca un producto por ID y lo modifica
router.put("/:pid", authAdmin, updateProduct);
// //Elimina un producto según su ID
router.delete("/:pid", authUser, deleteProductById);
export default router;
