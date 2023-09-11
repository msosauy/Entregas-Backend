import { cartModel } from "./models/cartModel.js";

export default class DbCartManager {
  getCarts = async () => {
    return await cartModel.find();
  };

  //Crea un nuevo carrito con ID autogenerado
  newCart = async () => {
    try {
      const cartList = await cartModel.find().sort({ id: -1 });

      const cart = {
        id: cartList[0].id + 1,
        products: [],
      };

      const result = await cartModel.insertMany(cart);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("No se pudo crear el carrito");
    }
  };

  //Devuelve todos los productos de un carrito según su ID
  getProductsFromCartId = async (cid) => {
    try {
      const result = await cartModel.findOne({ id: cid });
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  //agrega un producto al carrito seleccionado por ID
  addProductToCart = async (cartId, productId) => {
    const cart = await cartModel.findOne({id: cartId});
    const doesProductExist = cart.products.some((product) => {
      return product.product === productId
    })

    if (doesProductExist) {
      cart.products = cart.products.map((product) => {
        if (product.product === productId) {
          return {...product, quantity: product.quantity + 1 }
        }
        return product
      })
    }else{
      cart.products = [...cart.products, {product: productId, quantity: 1}] 
    }

    const cartUpdate = await cart.save()
    return cartUpdate;
  };
}
