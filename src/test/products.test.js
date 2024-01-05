import mongoose from "mongoose";
import Product from "../dao/mongodb/db.ProductManager.js";
import * as chai from "chai";

mongoose.connect("mongodb+srv://msosa:OJ9bgeMIrDF7pkEV@cluster-coder.bxbohyn.mongodb.net/ecommerce");
const expect = chai.expect;
const pid = "64f763fab18cecd041b01acc";

describe("Testing Product Dao", () => {
  before(function () {
    this.productDao = new Product();
  });

  beforeEach(function () {
    mongoose.connection.collection.products.drop();
    this.timeout(5000);
  });

  it("getProductById Debe devolver un objeto con los datos del producto", async function () {
    const product = await this.productDao.getProductById(pid);
    expect(product).to.be.an("object");
    expect(product).to.have.property("id");
  });
});
