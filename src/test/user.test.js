import Cart from "../dao/mongodb/db.CartManager.js";
import Assert from "assert";
import { describe, it, before, beforeEach } from "mocha";

const assert = Assert.strict;
const cid = 1;
// const _id = "6552f16f7e512191f9ec4b72";

describe("Testing User Dao", async function () {
  before(function () {
    this.cart = new Cart();
  });
  beforeEach(function () {
    this.timeout(5000);
  });
  it("[getUserById] Debe devolver un objeto con los datos del usuario", async function () {
    const products = await this.cart.getProductsFromCartId(cid);
    assert.strictEqual(typeof products, "object");
  });
});