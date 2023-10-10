import mongoose from "mongoose";

const collection = "usersHash";

const schema = new mongoose.Schema({
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  userName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  age: { type: Number, require: true, default: 18 },
  password: { type: String, require: true },
  cart: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        }
      },
    ],
    default: [],
    _id: false,
  },
  role: { type: String, default: "user" },
});

export const userModel = mongoose.model(collection, schema);
