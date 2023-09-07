import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  products: [
    {
      product: { type: Number, require: true },
      quantity: { type: Number, require: true },
    },
  ],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);