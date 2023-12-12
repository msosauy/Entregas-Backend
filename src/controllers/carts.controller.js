import DbCartManager from "../dao/mongodb/db.CartManager.js";
import { Carts } from "../dao/factory.js";
import { Products } from "../dao/factory.js";
import { Tickets } from "../dao/factory.js";
import { Users } from "../dao/factory.js";
import { cartModel } from "../dao/models/cartModel.js";
import { productModel } from "../dao/models/productModel.js";
import { sendMail } from "../controllers/notification.controller.js";
import { errMessage, handleError } from "../middlewares/errors/handleError.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { valueNotValid } from "../services/errors/info.js";

const dbcartManager = new DbCartManager();
const carts = new Carts();
const products = new Products();
const tickets = new Tickets();
const users = new Users();

//Crea un nuevo carrito con ID autogenerado
export const newCart = async (req, res) => {
  try {
    const newCartId = await dbcartManager.newCart(req.user);
    return res.status(200).send({
      status: "success",
      success: `Nuevo carrito creado correctamente, ID: ${newCartId.id}, MongoID:${newCartId._id}`,
    });
  } catch (error) {
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};
//Devuelve todos los productos de un carrito según su ID por params
export const getProdByIdByCartId = async (req, res) => {
  const cid = req.params.cid;

  try {
    if (isNaN(cid)) {
      const el = {
        name: "/:cid",
        value: cid,
      };
      const type = "NUMBER";
      CustomError.createError({
        statusCode: 400,
        message: `${el.name} ${errMessage.MUST_BE_NUMBER}`,
        code: EErrors.INVALID_TYPES_ERROR,
        cause: valueNotValid(el, type),
      });
    }

    //primero chequeamos que el carrito exista
    const cartExist = await cartModel.findOne({ id: cid });
    if (!cartExist) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.CART_NOT_EXIST,
        code: EErrors.DATABASE_ERROR,
        cause: `El carrito con id: ${cid} no existe`,
      });
    }

    //si el carrito existe pero está vacío devolvemos:
    if (cartExist.products.length === 0) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.CART_EMPTY,
        code: EErrors.DATABASE_ERROR,
        cause: `El carrito con id: ${cid} ya fue creado, pero está vacío`,
      });
    }

    const populateCart = await cartModel
      .findOne({ id: cid })
      .populate("products.product");
    return res.status(200).send(populateCart);
  } catch (error) {
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};
//Agrega el producto indicado por ID, al carrito indicado por ID (recive un _id de mongoDB)
export const addProductByIdToCartById = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    //primero chequeamos que el carrito exista
    const cartExist = await cartModel.findOne({ id: cartId });
    if (!cartExist) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.CART_NOT_EXIST,
        code: EErrors.DATABASE_ERROR,
        cause: `El carrito con ID: ${cartId} no existe`,
      });
    }

    const resultAdd = await dbcartManager.addProductToCart(cartId, productId);

    return res.status(201).send({
      status: "success",
      success: "Producto agregado correctamente",
      cart: resultAdd,
    });
  } catch (error) {
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};
//Elimina un producto del carrito indicado por ID
export const removeProductByIdFromCartById = async (req, res) => {
  const cartId = +req.params.cid;
  const productId = req.params.pid;

  try {
    //primero chequeamos que el carrito exista
    const cartExist = await cartModel.findOne({ id: cartId });
    if (!cartExist) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.CART_NOT_EXIST,
        code: EErrors.DATABASE_ERROR,
        cause: `El carrito con ID: ${cartId} no existe`,
      });
    }

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
  } catch (error) {
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};
//Elimina todos los productos de un carrito
export const removeAllProductFromCart = async (req, res) => {
  const cartId = +req.params.cid;

  try {
    //primero chequeamos que el carrito exista
    const cartExist = await cartModel.findOne({ id: cartId });
    if (!cartExist) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.CART_NOT_EXIST,
        code: EErrors.DATABASE_ERROR,
        cause: `El carrito con ID: ${cartId} no existe`,
      });
    }

    const resultRemove = await dbcartManager.removeAllProductFromCart(cartId);
    if (resultRemove.acknowledged === true) {
      return res
        .status(200)
        .send({ status: "success", success: "Carrito vaciado correctamente" });
    }
  } catch (error) {
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};
//Actualiza todos los productos de un carrito
export const updateCartProducts = async (req, res) => {
  const cartId = +req.params.cid;
  const productList = req.body;

  try {
    //primero chequeamos que el carrito exista
    const cartExist = await cartModel.findOne({ id: cartId });
    if (!cartExist) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.CART_NOT_EXIST,
        code: EErrors.DATABASE_ERROR,
        cause: `El carrito con ID: ${cartId} no existe`,
      });
    }

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
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};
//actualiza la cantidad del producto indicado
export const updateProductQuantity = async (req, res) => {
  const cartId = +req.params.cid;
  const productId = req.params.pid;
  const newQuantity = req.body;

  //primero chequeamos que el carrito exista
  const cartExist = await cartModel.findOne({ id: cartId });
  try {
    if (!cartExist) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.CART_NOT_EXIST,
        code: EErrors.DATABASE_ERROR,
        cause: `El carrito con ID: ${cartId} no existe`,
      });
    }

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
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};
//Cerrar compra
export const cartPurchase = async (req, res) => {
  const cartId = +req.params.cid;
  const user = req.user;

  try {
    //chequear STOCK
    const { outOfStock, orderProducts } = await carts.checkStock(cartId);
    //Obtener ticket de compra
    const ticketData = await carts.getTicket(orderProducts, user);
    //Generar orden
    const isOrderDone = await tickets.generateTicket(ticketData);
    if (isOrderDone) {
      //Restar stock de los productos selecionados.
      await products.updateStock(orderProducts);
      //Quitar los productos comprados del carrito
      for (const item of orderProducts) {
        await carts.removeProductFromCart(cartId, item._id);
      }

      //Devolver un array con los ids de los productos que no pudieron comprarse
      const data = { ticketData, orderProducts, outOfStock };
      //Envío de mail
      const mailSent = await sendMail(data);

      return res.status(200).send({ status: "success", success: "ok", data });
    }
    CustomError.createError({
      statusCode: 500,
      message: errMessage.CART_NOT_EXIST,
      code: EErrors.DATABASE_ERROR,
      cause: `El carrito con ID: ${cartId} no existe`,
    });
  } catch (error) {
    if (error.statusCode === 500) {
      req.logger.fatal(error.message, error.cause);
      return handleError(error, req, res);
    }
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};

export const getCartFromUser = async (req, res) => {
  const user = req.user;

  let orderProducts = [];
  let cartId;

  try {
    const cartFromUser = await users.getCartFromUser(user); //Obtenemos el _id del carrito desde el usuario
    const cartProducts = await carts.getProductsFromCartId(
      cartFromUser.cart.id
    ); //Obtenemos los productos de ese carrito

    cartId = cartFromUser.cart.id;

    for (const item of cartProducts) {
      const product = await productModel.findById(item.product);
      orderProducts.push({
        _id: product._id,
        code: product.code,
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: item.quantity,
      });
    }
    const totalAmount = await carts.calculateTotalAmount(orderProducts);

    const payload = { orderProducts, totalAmount, cartId };

    return res.status(200).send({ status: "success", payload });
  } catch (error) {
    req.logger.error(error.message, error.cause);
    return handleError(error, req, res);
  }
};
