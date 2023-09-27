import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema({
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  email: { type: String, require: true },
  age: { type: String, require: true },
  password: { type: String, require: true },
  admin: { type: Boolean, default: false}
});

export const userModel = mongoose.model(collection, schema);
