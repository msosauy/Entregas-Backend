import { Products } from "../dao/factory.js";
import { emitProducts } from "../sockets/SocketHandler.js";
import ProductDTO from "../dao/dto/productDTO.js";
import { generateProduct } from "../utils.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {
  generateAddProductErrorInfo,
  valueNotValid,
} from "../services/errors/info.js";
import { errMessage, handleError } from "../middlewares/errors/handleError.js";
import { userModel } from "../dao/models/userModel.js";

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
    return res.status(200).send(products);
  } catch (error) {
    req.logger.error(error.message)
    return res.status(500).send({ status: "error", error: error });
  }
};
// //Busca un producto por ID por params
export const getProductById = async (req, res) => {
  const searchId = req.params.pid;

  try {
    if (isNaN(searchId)) {
      const el = {
        name: "searchId",
        value: searchId,
      };
      const type = "NUMBER";

      CustomError.createError({
        statusCode: 400,
        message: `searchId ${errMessage.MUST_BE_NUMBER}`,
        cause: valueNotValid(el, type),
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const product = await productService.getProductById(searchId);

    if (product === null) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.PRODUCT_NOT_EXIST,
        cause: errMessage.PRODUCT_NOT_EXIST,
        code: EErrors.DATABASE_ERROR,
      });
    }
    return res.status(200).send({ status: "success", success: product });
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause}`);
    return handleError(error, req, res)
  }
};
// //Agrega un nuevo producto
export const addProduct = async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;
    
  status = JSON.parse(status); //convierte a boolean

  try {
    //Chequeamos que no falten datos requeridos
    const evaluateRequired = [
      { name: "title", value: title },
      { name: "description", value: description },
      { name: "code", value: code },
      { name: "price", value: price },
      { name: "status", value: JSON.parse(status) },
      { name: "stock", value: stock },
      { name: "category", value: category },
    ];

    //verificamos que los valores no sea null, undefined o string vacio
    for (const el of evaluateRequired) {
      if (el.value === null || el.value === undefined || el.value === "") {
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${errMessage.VALUE_MISS}`,
          code: EErrors.INVALID_TYPES_ERROR,
          cause: generateAddProductErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
          }),
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
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${errMessage.MUST_BE_STRING}`,
          code: EErrors.INVALID_TYPES_ERROR,
          cause: generateAddProductErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
          }),
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
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${
            errMessage.MUST_BE_NUMBER_NOT_STRING
          }`,
          code: EErrors.INVALID_TYPES_ERROR,
          cause: generateAddProductErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
          }),
        });
      }

      if (isNaN(el.value)) {
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${errMessage.MUST_BE_NUMBER}`,
          code: EErrors.INVALID_TYPES_ERROR,
          cause: generateAddProductErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
          }),
        });
      }
    }

    const evaluateBoolean = [{ name: "status", value: status }];

    //Chequeamos que status sea un BOOLEAN
    for (const el of evaluateBoolean) {
      if (typeof el.value != "boolean") {
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${errMessage.MUST_BE_BOOLEAN}`,
          code: EErrors.INVALID_TYPES_ERROR,
          cause: generateAddProductErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
          }),
        });
      }
    }
  } catch (error) {
    req.logger.error(error.message + " | " + error.cause);
    return handleError(error, req, res);
  }

  const _user = await userModel.findOne({email: req.user.email});

  let productToDTO = {
    title,
    description,
    price,
    thumbnails,
    stock,
    status,
    category,
    code,
    owner: _user._id,
  };

  let newProduct = new ProductDTO(productToDTO);

  try {
    const resultAdd = await productService.addProduct(newProduct);

    if (resultAdd === errMessage.PRODUCT_EXIST) {
      CustomError.createError({
        status: 201,
        message: errMessage.PRODUCT_EXIST,
        code: EErrors.DATABASE_ERROR,
        cause: errMessage.PRODUCT_EXIST,
      });
    }

    await emitProducts();

    if (resultAdd === errMessage.PRODUCT_ADDED) {
      return res.status(201).send({
        status: "success",
        success: errMessage.PRODUCT_ADDED,
      });
    }
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause}`);
    return res.status(error.status).send(handleError(error));
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

  try {

    //Chequeamos que el producto pertenezca al usuario
    const product = await productService.getProductById(__id);
    const productOwner = await userModel.findById(product.owner);
    
    if (product.owner != req.user.id && req.user.role != "admin") {
      CustomError.createError({
        statusCode: 401,
        message: errMessage.PRODUCT_NOT_OWNER,
        cause: `${errMessage.PRODUCT_NOT_OWNER} porque fue creado por ${productOwner.email}`,
        code: EErrors.DATABASE_ERROR,
      });
    };
    
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
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${errMessage.VALUE_MISS}`,
          cause: generateAddProductErrorInfo({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
          }),
          code: EErrors.INVALID_TYPES_ERROR,
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
        const type = "STRING";
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${errMessage.MUST_BE_STRING}`,
          cause: valueNotValid(el, type),
          code: EErrors.INVALID_TYPES_ERROR,
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
        const type = "STRING";
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${errMessage.CANT_BE_STRING}`,
          cause: valueNotValid(el, type),
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }

      if (isNaN(el.value)) {
        const type = "NUMBER";
        CustomError.createError({
          statusCode: 400,
          message: `${el.name.toUpperCase()} ${errMessage.MUST_BE_NUMBER}`,
          cause: valueNotValid(el, type),
          code: EErrors.INVALID_TYPES_ERROR,
        });
      }
    }

    //Chequeamos que status sea un BOOLEAN
    if (typeof status != "boolean") {
      const el = {
        name: "STATUS",
        value: status,
      };
      const type = "BOOLEAN";
      CustomError.createError({
        statusCode: 400,
        message: `${el.name} ${errMessage.MUST_BE_BOOLEAN}`,
        cause: valueNotValid(el, type),
        code: EErrors.INVALID_TYPES_ERROR,
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

    await productService.updateProduct(__id, resutlCompare);
    return res.status(201).send({
      status: "success",
      success: errMessage.PRODUCT_UPDATED,
    });
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause}`);
    return handleError(error, req, res);
  }
};
// //Elimina un producto según su ID
export const deleteProductById = async (req, res) => {
  const pid = +req.params.pid;

  try {

    //Chequeamos que el producto pertenezca al usuario
    const product = await productService.getProductById(pid);
    const productOwner = await userModel.findById(product.owner);
    
    if (product.owner != req.user.id && req.user.role != "admin") {
      CustomError.createError({
        statusCode: 401,
        message: errMessage.PRODUCT_NOT_OWNER,
        cause: `${errMessage.PRODUCT_NOT_OWNER} porque fue creado por ${productOwner.email}`,
        code: EErrors.DATABASE_ERROR,
      });
    };
    
    
    const result = await productService.deleteProduct(pid);
    if (result.acknowledged === true && result.deletedCount === 0) {
      CustomError.createError({
        status: 400,
        message: errMessage.PRODUCT_NOT_EXIST,
        cause: errMessage.PRODUCT_NOT_EXIST,
        code: EErrors.DATABASE_ERROR,
      });
    }

    await emitProducts();

    return res
      .status(200)
      .send({ status: "success", success: errMessage.PRODUCT_REMOVED });
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause}`);
    return handleError(error, req, res);
  }
};
//Mocking products
export const mockingProducts = (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }
  res.send({ status: "success", payload: products });
};
