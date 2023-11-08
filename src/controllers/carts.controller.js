import DbCartManager from "../dao/mongodb/db.CartManager.js";
import { Carts } from "../dao/factory.js";
import { Products } from "../dao/factory.js";
import { cartModel } from "../dao/models/cartModel.js";

const dbcartManager = new DbCartManager();
const carts = new Carts();
const products = new Products();
//Crea un nuevo carrito con ID autogenerado
export const newCart = async (req, res) => {
  try {
    const newCartId = await dbcartManager.newCart();
    return res.status(200).send({
      status: "success",
      success: `Nuevo carrito creado correctamente, ID: ${newCartId.id}, MongoID:${newCartId._id}`,
    });
  } catch (error) {
    if (error.message === "No se pudo crear el carrito") {
      return res
        .status(500)
        .send({ status: "error", error: "No se pudo crear el nuevo carrito" });
    }
    return res.status(500).send({ status: "error", error: "Algo salió mal" });
  }
};
//Devuelve todos los productos de un carrito según su ID por params
export const getProdByIdByCartId = async (req, res) => {
  const cid = +req.params.cid;

  if (isNaN(cid)) {
    return res
      .status(400)
      .send({ status: "error", error: "/:cid debe ser un numero" });
  }

  //primero chequeamos que el carrito exista
  const cartExist = await cartModel.findOne({ id: cid });
  if (!cartExist) {
    return res
      .status(404)
      .send({ status: "error", error: "El carrito no existe" });
  }

  //si el carrito existe pero está vacío devolvemos:
  if (cartExist.products.length === 0) {
    return res
      .status(200)
      .send({ status: "succes", succes: "El carrito está vacío" });
  }

  try {
    const populateCart = await cartModel
      .findOne({ id: cid })
      .populate("products.product");
    return res.status(200).send(populateCart);
  } catch (error) {
    if (error.message === "El carrito no existe") {
      return res
        .status(404)
        .send({ status: "error", error: "El carrito no existe" });
    }
    res.status(500).send({ status: "error", error: "Algo no salió bien" });
  }
};
//Agrega el producto indicado por ID, al carrito indicado por ID
export const addProductByIdToCartById = async (req, res) => {
  const cartId = +req.params.cid;
  const productId = req.params.pid;

  //primero chequeamos que el carrito exista
  const cartExist = await cartModel.findOne({ id: cartId });
  if (!cartExist) {
    return res
      .status(404)
      .send({ status: "error", error: "El carrito no existe" });
  }

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
};
//Elimina un producto del carrito indicado por ID
export const removeProductByIdFromCartById = async (req, res) => {
  const cartId = +req.params.cid;
  const productId = req.params.pid;

  //primero chequeamos que el carrito exista
  const cartExist = await cartModel.findOne({ id: cartId });
  if (!cartExist) {
    return res
      .status(404)
      .send({ status: "error", error: "El carrito no existe" });
  }

  try {
    const resultRemove = await dbcartManager.removeProductFromCart(
      cartId,
      productId
    );

    if (resultRemove.acknowledged) {
      return res.status(200).send({
        status: "success",
        success: "Producto eliminado correctamente",
      });
    }

    if (resultRemove === "El producto no existe en este carrito") {
      return res.status(400).send({
        status: "error",
        error: "El producto no existe en este carrito",
      });
    }
  } catch (error) {
    console.error("router ERROR", error);
    if (error.message === "El producto no existe en este carrito") {
      return res.status(400).send({
        status: "error",
        error: "El producto no existe en este carrito",
      });
    }
    return res.status(400).send({ status: "error", error: error });
  }
};
//Elimina todos los productos de un carrito
export const removeAllProductFromCart = async (req, res) => {
  const cartId = +req.params.cid;

  //primero chequeamos que el carrito exista
  const cartExist = await cartModel.findOne({ id: cartId });
  if (!cartExist) {
    return res
      .status(404)
      .send({ status: "error", error: "El carrito no existe" });
  }

  try {
    const resultRemove = await dbcartManager.removeAllProductFromCart(cartId);
    if (resultRemove.acknowledged === true) {
      return res
        .status(200)
        .send({ status: "success", success: "Carrito vaciado correctamente" });
    }
  } catch (error) {
    console.error(error);
  }
};
//Actualiza todos los productos de un carrito
export const updateCartProducts = async (req, res) => {
  const cartId = +req.params.cid;
  const productList = req.body;

  //primero chequeamos que el carrito exista
  const cartExist = await cartModel.findOne({ id: cartId });
  if (!cartExist) {
    return res
      .status(404)
      .send({ status: "error", error: "El carrito no existe" });
  }

  try {
    const resultUpdate = await dbcartManager.updateCartProducts(
      cartId,
      productList
    );

    const cartUpdated = await dbcartManager.getProductsFromCartId(cartId);

    if (resultUpdate.acknowledged === true) {
      return res.status(200).send({
        status: "success",
        success: "Carrito actualizado correctamente",
        cart: cartUpdated,
      });
    }
  } catch (error) {
    console.error(error);
    return;
  }
};
//actualiza la cantidad del producto indicado
export const updateProductQuantity = async (req, res) => {
  const cartId = +req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body;

  //primero chequeamos que el carrito exista
  const cartExist = await cartModel.findOne({ id: cartId });
  if (!cartExist) {
    return res
      .status(404)
      .send({ status: "error", error: "El carrito no existe" });
  }

  try {
    const cartUpdate = await dbcartManager.quantityUpdate(
      cartId,
      productId,
      newQuantity.newQuantity
    );

    if (cartUpdate) {
      return res.status(200).send({
        status: "success",
        success: "Carrito actualizado correctamente",
        cart: cartUpdate,
      });
    }
  } catch (error) {
    console.error(error);
    return;
  }
};
//Cerrar compra
export const cartPurchase = async (req, res) => {
  const cartId = +req.params.cid;
  const user = req.session.user;

  try {
    //chequear STOCK
    const { outOfStock, orderProducts } = await carts.checkStock(cartId);

    //Obtener ticket de compra
    const ticketData = await carts.getTicket(orderProducts, user);

    //Restar stock de los productos selecionados.
    await products.updateStock(orderProducts);

    //Quitar los productos comprados del carrito
    for (const item of orderProducts) {
      await carts.removeProductFromCart(cartId, item._id);
    }
    //Devolver un array con los ids de los productos que no pudieron comprarse
    const data = { ticketData, orderProducts, outOfStock };
    return res.status(200).send({ status: "success", success: "ok", data });
  } catch (error) {
    console.error("carts.controller.js_01", error);
    return res.status(500).send({ status: "success", error: error });
  }
};
