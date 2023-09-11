import { productModel } from "./models/productModel.js";

export default class DbProductManager {
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
    //verificamos que no se ingrese un producto con un codigo existente.
    const resultCode = await productModel.findOne({ code: code });
    if (resultCode !== null) {
      console.error("El codigo de producto ya existe");
      return "El codigo de producto ya existe";
    }

    //ordena todos los productos por ID de forma descendente
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

    try {
      await productModel.insertMany(product);
    } catch (error) {
      console.log(error);
    }
    return;
  };

  //recibe los parametros prodId (producto a editar) y un objeto solo con los datos a editar
  updateProduct = async (prodId, valuesToUpdate) => {
    const resultMap = Object.keys(valuesToUpdate);
    resultMap.map(async (key) => {
      if (key !== "thumbnails") {
        const objUpdate = {};
        objUpdate[key] = valuesToUpdate[key];
        const productResponse = await productModel.updateOne(
          { id: prodId },
          objUpdate
        );
        if (productResponse.acknowledged === false) {
          console.log(`No se pudo actualizar el campo ${objUpdate}`);
        }
      }
    });
  };

  deleteProduct = async (removeId) => {
    try {
      const result = await productModel.deleteOne({ id: removeId });
      return result;
    } catch (error) {
      console.log(error);
    }
  };
}
