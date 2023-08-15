import { Router } from "express";
import ProductManager from "./../ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/products.json");

router.use((req, res, next) => {
  next();
});
//Devuelve todos los productos
router.get("/", async (req, res) => {
  let limit = req.query.limit;

  try {
    const products = await productManager.getProducts();

    if (!limit) {
      res.send(products);
      return;
    }

    if (isNaN(limit)) {
      return res
        .status(400)
        .send({ status: "erorr", error: "limit debe ser un numero" });
    }

    const productsLimited = products.slice(0, limit);
    return res.send(productsLimited);
  } catch (err) {
    console.log(err);
  }
});
//Busca un producto por ID
router.get("/:pid", async (req, res) => {
  const searchId = +req.params.pid;

  if (isNaN(searchId)) {
    return res
      .status(400)
      .send({ status: "error", error: "searchId debe ser un numero" });
  }

  const products = await productManager.getProducts();

  if (searchId) {
    const productById = products.find((el) => el.id === searchId);
    if (!productById) {
      return res
        .status(400)
        .send({ status: "error", error: "El producto no existe" });
    }
    return res.send(productById);
  }
});
//Agrega un nuevo producto
router.post("/", async (req, res) => {
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
    await productManager.addProduct(
      title,
      description,
      price,
      thumbnails,
      stock,
      status,
      category,
      code
    );

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
});
//Busca un producto por ID y lo modifica
router.put("/:pid", async (req, res) => {
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

  const productToUpdate = { id: +req.params.pid, ...req.body };

  try {
    await productManager.updateProduct(productToUpdate);
    return res
      .status(201)
      .send({ status: "success", success: "Producto actualizado correctamente" });
  } catch (err) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo actualizar el producto" });
  }
});
//Elimina un producto según su ID
router.delete("/:pid", async (req, res) => {
  const pid = +req.params.pid;

  try {
    await productManager.deleteProduct(pid);
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
});

export default router;
