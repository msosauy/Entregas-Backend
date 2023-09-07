import { productModel } from "./models/productModel.js";

export default class DbProductManager {
  constructor() {
    this.products = [];
  }

  generateCode = (productsList) => {
    //Si existen productos, realiza la comparación para asegurar que el codigo no exista.
    if (productsList) {
      let newCode = Math.floor(Math.random() * 10000);

      for (let i = 0; i < productsList.length; i++) {
        const el = productsList[i];
        if (newCode === el.code) {
          newCode = Math.floor(Math.random() * 10000);
          i = 0;
        }
      }
      return newCode;
    }
    return Math.floor(Math.random() * 10000);
  };
  //Busca el ID mas alto existente y lo incrementa en 1. Garantiza que no se repitan los IDs.
  generateId = (productsList) => {
    if (productsList.length > 0) {
      const higherId = [];

      for (let i = 0; i < productsList.length; i++) {
        const el = productsList[i];
        higherId.push(el.id);
      }

      higherId.sort((a, b) => b - a);
      return higherId[0] + 1;
    }
    return 1;
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
    const productById = await productModel.findOne({id: searchId});
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
    const productList = await this.getProducts();

    const product = {
      title,
      description,
      price,
      thumbnails,
      stock,
      status,
      category,
      code: code ? code : this.generateCode(productList), //Si el usuario no envía "code se genera uno aleatorio"
      id: this.generateId(productList),
    };

    //verificamos que no se ingrese un producto con un codigo existente.
    for (const item of productList) {
      if (item.code === product.code) {
        console.error("El codigo de producto ya existe");
        throw new Error("El codigo de producto ya existe");
      }
    }

    try {
      await productModel.insertMany(product)
    } catch (error) {
      console.log(error);      
    }
    return;
  };

  deleteProduct = async (removeId) => {
    try {
      const result = await productModel.deleteOne({id: removeId});
      if (result.deletedCount === 0) {
        return "El articulo no existe";
      }
    } catch (error) {
      console.log(error);
    }
  }
}
