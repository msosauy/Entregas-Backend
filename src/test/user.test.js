import User from "../dao/mongodb/db.UserManager.js";
import Assert from "assert";

const assert = Assert.strict;
const _id = "6552f16f7e512191f9ec4b72";

describe("Testing User Dao", () => {
  before(async function () {
    this.userDao = new User();
  });
  beforeEach(function () {
    this.timeout(5000);
  });
  it("[getUserById] Debe devolver un objeto con los datos del usuario", async function () {
    const user = await userDao.getUserById(_id);
    assert.strictEqual(typeof userDao, "object");
  });
});
