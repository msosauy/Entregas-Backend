import mongoose from "mongoose";

const messageCollections = "messages";

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

export const messageModel = mongoose.model(messageCollections, messageSchema);
