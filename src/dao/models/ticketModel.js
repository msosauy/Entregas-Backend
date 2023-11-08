import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: { type: String, require: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, require: true },
  purchaser: { type: String, require: true },
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
