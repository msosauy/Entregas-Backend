import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  products: [
    {
      product: Number,
      quantity: Number
    },
  ],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);