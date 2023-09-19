import { cartModel } from "./models/cartModel.js";
import mongoose from "mongoose";

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
    cartModel.findOneAndUpdate(
      {
        $and: [
          { id: cartId },
          { "products.product": new mongoose.Types.ObjectId(productId) },
        ],
      },
      { $inc: { "products.$.quantity": 1 } }
    );

    const doesProductExist = await cartModel.findOne({
      $and: [
        { id: cartId },
        { "products.product": new mongoose.Types.ObjectId(productId) },
      ],
    });

    console.log(doesProductExist);

    // return cartUpdate;
    return await cartModel.findOne({ id: cartId });
  };
}
