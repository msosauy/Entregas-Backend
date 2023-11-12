export const generateUserErrorInfo = (product) => {
    return `Una o mas de las propiedades del usuario está imcompleta o no es valida
    Lista de prodpiedades:
    *id : debe ser un número, y se recibió ${product.id}
    *title : debe ser un string, y se recibió ${product.title}
    *description : debe ser un string, y se recibió ${product.description}
    `
};