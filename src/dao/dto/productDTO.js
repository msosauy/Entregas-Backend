import env from "../../config/enviroment.config.js";

export default class ProductDTO {
    constructor(product) {
      this.title = product.title;
      this.description = product.description;
      this.price = product.price;
      this.stock = product.stock;
      this.status = product.status;
      this.category = product.category;
      this.code = product.code;
      this.thumbnails = `${env.upload_files_path}/products/`;
      this.active = true;
      this.owner = product.owner;    }
  }