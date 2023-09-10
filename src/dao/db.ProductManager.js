import { productModel } from "./models/productModel.js";

export default class DbProductManager {
  constructor() {
    this.products = [];
  }

  addProduct = async (
    title,
    description,
    price,
    thumbnails,
    stock,
    status,
    category,
    code
  ) => {
    const productList = await productModel.find().sort({ id: -1 });

    const product = {
      title,
      description,
      price,
      thumbnails,
      stock,
      status,
      category,
      code,
      id: productList[0].id + 1,
    };

    //verificamos que no se ingrese un producto con un codigo existente.
    for (const item of productList) {
      if (item.code === product.code) {
        console.error("El codigo de producto ya existe");
        throw new Error("El codigo de producto ya existe");
      }
    }

    try {
      await productModel.insertMany(product);
    } catch (error) {
      console.log(error);
    }
    return;
  };

  getProducts = async () => {
    try {
      const products = await productModel.find();
      return products;
    } catch (error) {
      return error;
    }
  };

  getProductById = async (searchId) => {
    const productById = await productModel.findOne({ id: searchId });
    return productById;
  };

  //recibe los parametros
  updateProduct = async (prodId, valuesToUpdate) => {

    Object.entries(valuesToUpdate, async (key, value) => {
      console.log("key", key, "value", value);
      const productResponse = await productModel.updateOne({ id: prodId }, {key: value});
      console.log(productResponse);
    })
    console.log("llegó");
  };


  deleteProduct = async (removeId) => {
    try {
      const result = await productModel.deleteOne({ id: removeId });
      if (result.deletedCount === 0) {
        return "El articulo no existe";
      }
    } catch (error) {
      console.log(error);
    }
  };
}
