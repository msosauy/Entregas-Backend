import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  products: {
    type: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
    default: [],
    _id: false
  }
});

export const cartModel = mongoose.model(cartCollection, cartSchema);