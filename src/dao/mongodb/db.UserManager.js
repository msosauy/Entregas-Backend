import { userModel } from "../models/userModel.js";

export default class DbUserManager {
  addCartToUser = async (userId, cartId) => {
    const mongoUser = await userModel.findById(userId);

    if (mongoUser.cart[0]) {
      throw new Error("El usuario ya tiene un carrito abierto");
    }

    mongoUser.cart.push({ cart: cartId });
    const isSaved = mongoUser.save();
    if (isSaved) {
      return isSaved;
    }
    return false;
  };

  existCart = async (user) => {
    const mongoUser = await userModel.findById(user._id);

    if (mongoUser.cart[0]) {
      return true;
    }
    return false;
  };

  getCartFromUser = async (user) => {
    const mongoUser = await userModel.findById(user._id).populate("cart.cart");
    return mongoUser.cart[0];
  };

  getUserById = async (_id) => await userModel.findById(_id);
}
