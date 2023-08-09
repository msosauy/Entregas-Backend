import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const productManager = new ProductManager("src/products.json");

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("<h1>Este servidor recibe:</h1> <h3> 1. params numéricos en la ruta /products/?limit=[number]</h3><h3> 2. query numéricos en la ruta /products/:pid</h3>");
});

//QUERY
// /products?limit=4
app.get("/products", async (req, res) => {
  let limit = req.query.limit;
  
  const products = await productManager.getProducts();

  if (!limit) {
    return res.send(products);
  }

  if (isNaN(limit)) {
    return res
      .status(400)
      .send({ status: "error", error: "limit debe ser un número" });
  }

  const productsLimited = products.slice(0, limit);
  return res.send(productsLimited);
});


//PARAMS
app.get("/products/:pid", async (req, res) => {
  let searchId = +req.params.pid;

  if (isNaN(searchId)) {
    return res
      .status(400)
      .send({ status: "error", error: ":pid debe ser un número" });
  }

  const products = await productManager.getProducts();

  if (searchId) {
    const productById = products.find((el) => el.id === searchId);
    if (!productById) {
      return res
        .status(400)
        .send({ status: "error", error: "usuario no encontrado" });
    }
    return res.send(productById);
  }
});

app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});
