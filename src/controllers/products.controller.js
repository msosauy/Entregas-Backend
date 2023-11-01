import { Products } from "../dao/factory.js";
import { emitProducts } from "../sockets/SocketHandler.js";

const productService = new Products();

//Devuelve todos los productos o la cantidad de productos indicada con query ?limit=number
export const getProducts = async (req, res) => {
  const _limit = +req.query.limit || 10;
  const _page = +req.query.page || 1;
  const _query = req.query.query || null;
  const _sort = +req.query.sort;

  try {
    const products = await productService.getProducts(
      _limit,
      _page,
      _query,
      _sort
    );
    console.log("01", products);
    return res.status(200).send(products);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ status: "error", error: error });
  }
};
// //Busca un producto por ID por params
export const getProductById = async (req, res) => {
  const searchId = +req.params.pid;

  if (isNaN(searchId)) {
    return res
      .status(400)
      .send({ status: "error", error: "searchId debe ser un numero" });
  }

  const product = await productService.getProductById(searchId);

  if (product === null) {
    return res
      .status(400)
      .send({ status: "error", error: "El producto no existe" });
  }
  return res.status(200).send({ status: "success", success: product });
};
// //Agrega un nuevo producto
export const addProduct = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  //Chequeamos que no falten datos requeridos
  const evaluateRequired = [
    { name: "title", value: title },
    { name: "description", value: description },
    { name: "code", value: code },
    { name: "price", value: price },
    { name: "status", value: status },
    { name: "stock", value: stock },
    { name: "category", value: category },
  ];

  for (const el of evaluateRequired) {
    if (el.value === null || el.value === undefined || el.value === "") {
      return res.status(400).send({
        status: "error",
        error: `${el.name.toUpperCase()} debe contener un valor`,
      });
    }
  }

  //Chequeamos que title, description, code, category sean un STRING
  const evaluateString = [
    { name: "title", value: title },
    { name: "description", value: description },
    { name: "code", value: code },
    { name: "category", value: category },
  ];

  for (const el of evaluateString) {
    if (typeof el.value != "string") {
      return res.status(400).send({
        status: "error",
        error: `${el.name.toUpperCase()} debe ser un STRING`,
      });
    }
  }

  //Chequeamos que price y stock sean un número pero no un número/string
  const evaluateNum = [
    { name: "price", value: price },
    { name: "stock", value: stock },
  ];

  for (const el of evaluateNum) {
    if (typeof el.value === "string") {
      return res.status(400).send({
        status: "error",
        error: `${el.name.toUpperCase()} no puede ser un STRING, debe ser un NÚMERO`,
      });
    }

    if (isNaN(el.value)) {
      return res.status(400).send({
        status: "error",
        error: `${el.name.toUpperCase()} debe ser un NUMBER`,
      });
    }
  }

  //Chequeamos que status sea un BOOLEAN
  if (typeof status != "boolean") {
    return res.status(400).send({
      status: "error",
      error: "STATUS debe ser un boolean",
    });
  }

  try {
    const resultAdd = await productService.addProduct(
      title,
      description,
      price,
      thumbnails,
      stock,
      status,
      category,
      code
    );

    if (resultAdd === "El codigo de producto ya existe") {
      return res.status(201).send({
        status: "error",
        error: "El codigo de producto ya existe",
      });
    }

    await emitProducts();

    return res
      .status(201)
      .send({ status: "success", success: "Producto agregado correctamente" });
  } catch (err) {
    if (err.message === "Codigo de producto existente") {
      return res
        .status(409)
        .send({ status: "error", error: "Codigo de producto existente" });
    }
    return res
      .status(500)
      .send({ status: "error", error: "No se pudo agregar el producto" });
  }
};
// //Busca un producto por ID y lo modifica
export const updateProduct = async (req, res) => {
  const __id = +req.params.pid;

  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  //Chequeamos que no falten datos requeridos
  const evaluateRequired = [
    { name: "title", value: title },
    { name: "description", value: description },
    { name: "code", value: code },
    { name: "price", value: price },
    { name: "status", value: status },
    { name: "stock", value: stock },
    { name: "category", value: category },
    { name: "thumbnails", value: thumbnails },
  ];

  for (const el of evaluateRequired) {
    if (el.value === null || el.value === undefined || el.value === "") {
      return res.status(400).send({
        status: "error",
        error: `${el.name.toUpperCase()} debe contener un valor`,
      });
    }
  }
  //Chequeamos que title, description, code, category sean un STRING
  const evaluateString = [
    { name: "title", value: title },
    { name: "description", value: description },
    { name: "code", value: code },
    { name: "category", value: category },
  ];

  for (const el of evaluateString) {
    if (typeof el.value != "string") {
      return res.status(400).send({
        status: "error",
        error: `${el.name.toUpperCase()} debe ser un STRING`,
      });
    }
  }

  //Chequeamos que price y stock sean un número pero no un número/string
  const evaluateNum = [
    { name: "price", value: price },
    { name: "stock", value: stock },
  ];

  for (const el of evaluateNum) {
    if (typeof el.value === "string") {
      return res.status(400).send({
        status: "error",
        error: `${el.name.toUpperCase()} no puede ser un STRING`,
      });
    }

    if (isNaN(el.value)) {
      return res.status(400).send({
        status: "error",
        error: `${el.name.toUpperCase()} debe ser un NUMBER`,
      });
    }
  }

  //Chequeamos que status sea un BOOLEAN
  if (typeof status != "boolean") {
    return res.status(400).send({
      status: "error",
      error: "STATUS debe ser un boolean",
    });
  }

  //compara los 2 productos y retorna un objeto solo con los campos a editar
  const compareProduct = (originalProd, toUpdateProd) => {
    const differences = {};

    for (const key in originalProd) {
      if (toUpdateProd.hasOwnProperty(key)) {
        if (originalProd[key] !== toUpdateProd[key]) {
          differences[key] = toUpdateProd[key];
        }
      }
    }
    return differences;
  };

  const originalProduct = await productService.getProductById(__id);
  const toUpdateProduct = { id: __id, ...req.body };

  const resutlCompare = compareProduct(originalProduct, toUpdateProduct);

  try {
    await productService.updateProduct(__id, resutlCompare);
    return res.status(201).send({
      status: "success",
      success: "Producto actualizado correctamente",
    });
  } catch (err) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo actualizar el producto" });
  }
};
// //Elimina un producto según su ID
export const deleteProductById = async (req, res) => {
  const pid = +req.params.pid;

  try {
    const result = await productService.deleteProduct(pid);
    if (result.acknowledged === true && result.deletedCount === 0) {
      return res
        .status(404)
        .send({ status: "error", error: "El articulo no existe" });
    }

    await emitProducts();

    return res
      .status(200)
      .send({ status: "success", success: "Producto eliminado correctamente" });
  } catch (error) {
    if (error.message === "El articulo no existe") {
      return res.status(404).send({
        status: "error",
        error: "El articulo no existe",
      });
    }
    return res.status(500).send({
      status: "error",
      error: "No se pudo eliminar el producto",
    });
  }
};
