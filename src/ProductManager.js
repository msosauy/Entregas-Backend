import fs from "fs";

export default class ProductManager {
  constructor(filepath) {
    this.path = filepath;
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

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    // No se verifica el valor "code" ni "id".
    if (!title || !description || !price || !thumbnail || !stock) {
      console.error("Faltan datos requeridos");
      return;
    }

    const productList = await this.getProducts();

    const product = {
      title,
      description,
      price,
      thumbnail,
      stock,
      code: code ? code : this.generateCode(productList), //Si el usuario no envía "code se genera uno aleatorio"
      id: this.generateId(productList),
    };

    //verificamos que no se ingrese un producto con un codigo existente.
    for (const item of productList) {
      if (item.code === product.code) {
        console.error("ERROR: Codigo existente");
        return;
      }
    }

    this.products.push(product);

    //Se crea el archivo con el array de objetos products converido a json.
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
  };

  getProducts = async () => {
    try {
      const productsList = await fs.promises.readFile(this.path, "utf-8");
      const productListParse = JSON.parse(productsList);
      return productListParse;
    } catch (error) {
      return this.products;
    }
  };

  getProductsById = async (searchId) => {
    const productsList = await this.getProducts();
    for (const product of productsList) {
      if (product.id === searchId) {
        return product;
      }
    }
    return "Producto no encontrado";
  };

  updateProduct = async (
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) => {
    //verificamos que se ingresen todos los datos.
    if (
      !id ||
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      console.error("ERROR: Datos del producto incompletos");
      return;
    }

    const productList = await this.getProducts();

    //Recorremos el array, por cada item hacemos un return condicional
    let newProductsList = productList.map((item) => {
      if (item.id === id) {
        const updatedProduct = {
          ...item,
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        return updatedProduct;
      }
      return item; // Devuelve el elemento original si no se ha actualizado
    });

    //sobreescribimos el archivo con el contenido actualizado.
    await fs.promises.writeFile(this.path, JSON.stringify(newProductsList));
  };

  deleteProduct = async (searchId) => {
    const productsList = await this.getProducts();

    //Verificamos que el producto exista
    const existingCode = productsList.find(
      (product) => product.id === searchId
    );
    if (!existingCode) {
      console.error("ERROR: Codigo inexistente");
      return;
    }

    //Se crea una nueva lista sin el producto correspondiente al ID recibido
    const newProductList = productsList.filter(
      (product) => product.id !== searchId
    );

    await fs.promises.writeFile(this.path, JSON.stringify(newProductList));
    console.log("Producto eliminado");
    return newProductList;
  };

  getProductById = async (searchId) => {
    //Almacenamos el contenido del archivo creado en una variable, el cual sera un array de objetos. con un for..of recorremos el arreglo hasta encontrar uno con el mismo id que se ingresa como parametro.
    const productsList = await this.getProducts();
    for (const product of productsList) {
      if (product.id === searchId) {
        return product;
      }
    }
    return "Not found";
  };
}