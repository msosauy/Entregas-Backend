import { Router } from "express";
import { authPremium, authUser } from "../auth/authentication.js";
import {
  newCart,
  getProdByIdByCartId,
  addProductByIdToCartById,
  removeProductByIdFromCartById,
  removeAllProductFromCart,
  updateCartProducts,
  updateProductQuantity,
  cartPurchase,
  getCartFromUser
} from "../controllers/carts.controller.js";

const router = Router();

router.use((req, res, next) => {
  next();
});


//Devuelve el carrito de un usuario
router.get("/getcartfromuser", authUser, getCartFromUser);

//Crea un nuevo carrito con ID autogenerado
router.post("/", authPremium, newCart);

//Devuelve todos los productos de un carrito según su ID por params
router.get("/:cid", authUser, getProdByIdByCartId);


//Agrega el producto indicado por ID, al carrito indicado por ID
router.post("/:cid/product/:pid", authPremium, addProductByIdToCartById);

//Realiza la compra de todos los productos del carrito
router.post("/:cid/purchase", authUser, cartPurchase);

//Actualiza todos los productos de un carrito
router.put("/:cid", authUser, updateCartProducts );

//actualiza la cantidad del producto indicado
router.put("/:cid/product/:pid",  authUser, updateProductQuantity );

//Elimina un producto del carrito indicado por ID
router.delete("/:cid/product/:pid", authUser, removeProductByIdFromCartById);

//Elimina todos los productos de un carrito
router.delete("/:cid", authUser, removeAllProductFromCart );


export default router;
