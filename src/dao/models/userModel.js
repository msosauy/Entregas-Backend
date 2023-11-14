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
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
    default: [],
    _id: false,
  },
  role: { type: String, default: "user" },
  tickets: {
    type: [
      {
        ticket: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tickets",
        },
      },
    ],
    default: [],
    _id: false,
  },
});

export const userModel = mongoose.model(collection, schema);
