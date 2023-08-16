import fs from "fs";

export default class CartManager {
  constructor(filepath) {
    this.path = filepath;
    this.carts = [];
    this.cartProducts = [];
  }

  //Busca el ID mas alto existente y lo incrementa en 1. Garantiza que no se repitan los IDs.
  generateId = (carts) => {
    if (carts.length > 0) {
      const higherId = [];

      for (let i = 0; i < carts.length; i++) {
        const el = carts[i];
        higherId.push(el.id);
      }

      higherId.sort((a, b) => b - a);
      return higherId[0] + 1;
    }
    return 1;
  };

  getCarts = async () => {
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");
      const cartsListParse = JSON.parse(carts);
      return cartsListParse;
    } catch (error) {
      return;
    }
  };

  newCart = async () => {
    try {
      const cartsListParse = await this.getCarts();

      const cart = {
        id: this.generateId(cartsListParse),
        products: [],
      };

      this.carts.push(...cartsListParse, cart);
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
      return cart.id;
    } catch (error) {
      throw new Error("No se pudo crear el carrito");
    }
  };

  getProductsFromCartId = async (searchId) => {
    const carts = await this.getCarts();
    const searchCart = carts.find((cart) => cart.id === searchId);
    console.log(searchCart);
    if (searchCart === undefined) {
      throw new Error("El carrito no existe");
    }
    return searchCart.products;
  };

  addProductToCart = async (searchCid, searchPid) => {
    const carts = await this.getCarts();
    const searchCart = carts.find((cart) => cart.id === searchCid);

    //Si el carrito a editar no existe retorna todos los carritos
    if (!searchCart) {
      throw new Error("El carrito no existe");
    }

    //Revisamos si existe el producto
    const productToUpdate = searchCart.products.find(
      (el) => el.product === searchPid
    );

    //Si el producto existe su cantidad se incrementa en 1, si no existe su cantidad será 1
    const newProduct = productToUpdate
      ? { product: searchPid, quantity: productToUpdate.quantity + 1 }
      : { product: searchPid, quantity: 1 };

    //Si el producto no existe en el carrito lo agregamos
    if (!productToUpdate) {
      this.cartProducts.push(...searchCart.products, newProduct);
      const newCartToAdd = { id: searchCart.id, products: this.cartProducts };
      const removeCartToUpdate = carts.filter((cart) => cart.id != searchCid);
      const newCarts = [newCartToAdd, ...removeCartToUpdate];
      await fs.promises.writeFile(this.path, JSON.stringify(newCarts));
      this.cartProducts = [];
      return;
    }

    //Si el producto existe lo eliminamos y agregamos en nuevo producto actualizado
    const removeProductToUpdate = searchCart.products.filter(
      (el) => el.product != searchPid
    );
    const newProductsToAdd = [...removeProductToUpdate, newProduct];
    const newCartToAdd = { id: searchCart.id, products: newProductsToAdd };
    const removeCartToUpdate = carts.filter((cart) => cart.id != searchCid);
    const newCarts = [newCartToAdd, ...removeCartToUpdate];
    await fs.promises.writeFile(this.path, JSON.stringify(newCarts));
    this.cartProducts = [];
    return;
  };
}
