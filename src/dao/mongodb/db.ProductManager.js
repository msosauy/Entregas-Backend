import { errMessage } from "../../test/handleError.js";
import { productModel } from "../models/productModel.js";

export default class DbProductManager {
  getProducts = async (_limit, _page, _query, _sort) => {
    const limit = _limit || 10;
    const page = _page || 1;
    const query = _query ? { category: _query } : null;
    const sort = _sort ? { price: _sort } : null;

    let productsObj;

    await productModel.paginate(
      query,
      { page, limit, sort },
      (error, products) => {
        if (error) {
          throw new Error(error);
        }
        productsObj = {
          status: "success",
          payload: products.docs,
          totalPages: products.totalPages,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevLink: products.hasPrevPage
            ? `localhost:8080/api/products/?limit=${_limit}&page=${
                products.prevPage
              }${_query ? `&query=${_query}` : ""}${
                _sort ? `&sort=${_sort}` : ""
              }`
            : null,
          nextLink: products.hasNextPage
            ? `localhost:8080/api/products/?limit=${_limit}&page=${
                products.nextPage
              }${_query ? `&query=${_query}` : ""}${
                _sort ? `&sort=${_sort}` : ""
              }`
            : null,
        };
      }
    );
    return productsObj;
  };

  getProductById = async (searchId) => {
    const productById = await productModel.findOne({ id: searchId });
    return productById;
  };

  addProduct = async (product) => {
    //verificamos que no se ingrese un producto con un codigo existente.
    const resultCode = await productModel.findOne({ code: product.code });

    if (resultCode !== null) {
      return errMessage.PRODUCT_EXIST;
    }

    //ordena todos los productos por ID de forma descendente
    const productList = await productModel.find().sort({ id: -1 });

    const newProduct = {
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnails: product.thumbnails,
      stock: product.stock,
      status: product.status,
      category: product.category,
      code: product.code,
      id: productList[0].id + 1,
      active: product.active,
    };

    try {
      const addResult = await productModel.insertMany(newProduct);
      if (addResult) {
        return errMessage.PRODUCT_ADDED;
      }
    } catch (error) {
      console.error("addResult db.ProductManager", error);
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
          console.error(`No se pudo actualizar el campo ${objUpdate}`);
        }
      }
    });
  };

  deleteProduct = async (removeId) => {
    const result = await productModel.deleteOne({ id: removeId });
    if (result.acknowledged === true && result.deletedCount === 0) {
      throw new Error(errMessage.PRODUCT_NOT_EXIST);
    }
    return result;
  };

  //Recibe un array de productos (utiliza _id & quantity)
  updateStock = async (orderProducts) => {
    for (const item of orderProducts) {
      let productToUpdate = await productModel.findById(item._id);
      const newStock = productToUpdate.stock - item.quantity;

      const updateResponse = await productModel.updateOne(
        { _id: item._id },
        { stock: newStock }
      );

      if (updateResponse.acknowledged === false) {
        console.error(
          `No se pudo actualizar el stock del producto ${item._id}`
        );
      }
    }
  };
}
