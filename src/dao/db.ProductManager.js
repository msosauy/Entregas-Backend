import { productModel } from "./models/productModel.js";

export default class DbProductManager {
  getProducts = async (_limit, _page, _query, _sort) => {
    const limit = _limit || 10;
    const page = _page || 1;
    const query = _query? {category: _query} : null;
    const sort = _sort? {price: _sort} : null;

    let productsObj;

    await productModel.paginate(query, { page, limit, sort }, (error, products) => {
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
        prevLink: products.hasPrevPage? `localhost:8080/api/products/?limit=${_limit}&page=${products.prevPage}${_query? `&query=${_query}` : ""}${_sort? `&sort=${_sort}` : ""}`: null,
        nextLink: products.hasNextPage? `localhost:8080/api/products/?limit=${_limit}&page=${products.nextPage}${_query? `&query=${_query}` : ""}${_sort? `&sort=${_sort}` : ""}`: null,
      }
    });
    return productsObj;
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
      throw new Error("El codigo de producto ya existe");
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
    const result = await productModel.deleteOne({ id: removeId });
    if (result.acknowledged === true && result.deletedCount === 0) {
      throw new Error("El articulo no existe");
    }
    return result;
  };
}
