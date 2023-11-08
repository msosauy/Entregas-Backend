import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";
import { generateUniqueTicketCode } from "../../controllers/ticketsController.js";

export default class DbCartManager {
  getCarts = async () => {
    return await cartModel.find();
  };

  //Crea un nuevo carrito con ID autogenerado
  newCart = async () => {
    try {
      const cartList = await cartModel.find().sort({ id: -1 });

      let newCartId;
      if (cartList.length === 0) {
        newCartId = 1;
      } else {
        newCartId = cartList[0].id + 1;
      }

      const cart = {
        id: newCartId,
        // products: [], no es necesario agregar el array vacío ya que mongoose lo crea por defecto
      };

      const result = await cartModel.create(cart);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("No se pudo crear el carrito");
    }
  };

  //Devuelve todos los productos de un carrito según su ID
  getProductsFromCartId = async (cid) => {
    try {
      const result = await cartModel.findOne({ id: cid });
      return result.products;
    } catch (error) {
      console.log(error);
    }
  };

  //agrega un producto al carrito seleccionado por ID
  addProductToCart = async (cartId, productId) => {
    const cart = await cartModel.findOne({ id: cartId });
    const doesProductExist = cart.products.some(
      (product) => product.product == productId
    );

    if (doesProductExist) {
      cart.products = cart.products.map((product) => {
        if (product.product == productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
    } else {
      cart.products = [...cart.products, { product: productId, quantity: 1 }];
    }

    const cartUpdate = await cart.save();
    return cartUpdate;
  };

  //Elimina un producto del carrito indicado por ID
  removeProductFromCart = async (cartId, productId) => {
    try {
      const doesProductExist = await cartModel.findOne({
        id: cartId,
        "products.product": productId,
      });

      if (doesProductExist) {
        const remove = await cartModel.updateOne(
          { id: cartId },
          { $pull: { products: { product: productId } } }
        );
        return remove;
      }
      return "El producto no existe en este carrito";
    } catch (error) {
      console.error("db.CartManager.js", error);
      throw new Error(error);
    }
  };

  //Elimina todos los productos del carrito indicado por ID
  removeAllProductFromCart = async (cartId) => {
    try {
      const cartUpdated = await cartModel.updateOne(
        { id: cartId },
        { products: [] }
      );
      return cartUpdated;
    } catch (error) {
      console.error("db.CartManager.js", error);
      throw new Error(error);
    }
  };

  //actualiza todo el carrito
  updateCartProducts = async (cartId, productList) => {
    try {
      const cartUpdated = await cartModel.updateOne(
        { id: cartId },
        { products: productList }
      );
      return cartUpdated;
    } catch (error) {
      console.error(error);
      return;
    }
  };

  //actualiza la cantidad de un producto
  quantityUpdate = async (cartId, productId, newQuantity) => {
    const cart = await cartModel.findOne({ id: cartId });
    const doesProductExist = cart.products.some(
      (product) => product.product == productId
    );

    if (doesProductExist) {
      cart.products = cart.products.map((product) => {
        if (product.product == productId) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
    } else {
      cart.products = [
        ...cart.products,
        { product: productId, quantity: newQuantity },
      ];
    }

    const cartUpdate = await cart.save();
    return cartUpdate;
  };

  calculateTotalAmount = async (orderProducts) => {
    let totalAmount = 0;

    for (const item of orderProducts) {
      const product = await productModel.findById(item._id);
      const productPrice = product.price;

      totalAmount += productPrice * item.quantity;
    }
    return totalAmount;
  };

  checkStock = async (cartId) => {
    let outOfStock = [];
    let orderProducts = [];

    const cartProducts = await this.getProductsFromCartId(cartId);

    for (const item of cartProducts) {
      const product = await productModel.findById(item.product);
      if (item.quantity > product.stock) {
        outOfStock.push(product);
      } else {
        orderProducts.push({
          _id: product._id,
          code: product.code,
          title: product.title,
          description: product.description,
          price: product.price,
          quantity: item.quantity,
        });
      }
    }
    return { outOfStock, orderProducts };
  };

  getTicket = async (orderProducts, user) => {
    const ticketData = {
      code: generateUniqueTicketCode(),
      purchase_datetime: new Date(),
      amount: await this.calculateTotalAmount(orderProducts),
      purchaser: user.email,
    };
    return ticketData;
  };
}
