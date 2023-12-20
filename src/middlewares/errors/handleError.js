export const errMessage = {
    //VALUES
    VALUE_MISS: "debe contener un valor",
    MUST_BE_STRING: "debe ser un STRING",
    CANT_BE_STRING: "no puede ser un STRING",
    MUST_BE_NUMBER: "debe ser un NUMBER",
    MUST_BE_BOOLEAN: "debe ser un BOOLEAN",
    MUST_BE_NUMBER_NOT_STRING: "no puede ser un STRING, de be ser un NUMBER",
    //PRODUCTS
    PRODUCT_EXIST: "El codigo de producto ya existe",
    PRODUCT_NOT_EXIST: "El producto no existe",
    PRODUCT_ADDED: "Producto agregado correctamente",
    PRODUCT_UPDATED: "Producto actualizado correctamente",
    PRODUCT_DONT_EXIST: "El articulo no existe",
    PRODUCT_REMOVED: "Producto eliminado correctamente",
    //CARTS
    CART_EXIST: "Ya existe un carrito para este usuario",
    CART_NOT_EXIST: "El carrito no existe",
    CART_EMPTY: "El carrito está vacío",
    CART_PRODUCT_NOT_EXIST: "El producto no existe en este carrito",
    //SESSION
    SESSION_MUST_BE_EMAIL: "Debes ingresar un mail",
    SESSION_DON_EXIST: "El correo no pertenece a ninguna cuenta",
    SESSION_USER_NOT_FOUND: "El usuario no existe",
};
  
export const handleError = (error, req, res) => {
    res.status(error.statusCode).send({status: `${error.name} ${error.statusCode}`, error: error.message, cause: error.cause});
};