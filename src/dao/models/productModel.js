import mongoose from "mongoose";

const productCollection = "products"

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    thumbnails: [String, String],
})

export const productModel = mongoose.model(productCollection, productSchema)