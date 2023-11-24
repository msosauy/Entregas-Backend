export const generateAddProductErrorInfo = (product) => {
    return `
    Una o mas de las propiedades del usuario está imcompleta o no es valida
    Lista de prodpiedades:
    *title : debe ser un string, y se recibió [${product.title} tipo: ${typeof(product.title)}]
    *description : debe ser un string, y se recibió [${product.description} tipo: ${typeof(product.description)}]
    *code : debe ser un número, y se recibió [${product.code} tipo: ${typeof(product.code)}]
    *price : debe ser un número, y se recibió [${product.price} tipo: ${typeof(product.price)}]
    *status : debe ser un boolean, y se recibió [${product.status} tipo: ${typeof(product.status)}]
    *stock : debe ser un número, y se recibió [${product.stock} tipo: ${typeof(product.stock)}]
    *category : debe ser un string, y se recibió [${product.category} tipo: ${typeof(product.category)}]
    *thumbnails : debe ser un string, y se recibió [${product.thumbnails} tipo: ${typeof(product.thumbnails)}]
    `
};