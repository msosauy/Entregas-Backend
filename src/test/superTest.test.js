import supertest from "supertest";
import * as chai from "chai";
import env from "../config/enviroment.config.js";

const PORT = env.port;
const expect = chai.expect;
const requester = supertest.agent(`http://localhost:${PORT}`);
const productToFind = 1;
const userLogin = { email: "user@user.com", password: "user098" };
let responseLogin;

describe("Testing USUARIOS", () => {
  describe("Testing User Dao", () => {
    it("Debe devolver un objeto con los datos del usuario, se comprueba que exista el campo _id", async () => {
      const response = await requester.get(
        "/api/users/6552f16f7e512191f9ec4b72"
      );
      expect(response.status).to.equal(200);
      expect(response.body.user).to.have.property("_id");
    });
  });
});

//test de productos
describe("Testing PRODUCTOS", () => {
  describe("Testing Product Dao, get product by id", () => {
    before(async function () {
      responseLogin = await requester.post("/session/login").send(userLogin);
    });
    it("Debe devolver un objeto con los datos del producto, chequeamos que exista la propiedad _id", async () => {
      const response = await requester
        .get(`/api/products/${productToFind}`)
        .set("authorization", `Bearer ${responseLogin.body.token}`);
      expect(response.status).to.equal(200);
      expect(response.body.success).to.have.property("_id");
    });
    it("Debe devolver una lista con los 10 primeros productos", async () => {
      const response = await requester
        .get("/api/products")
        .set("authorization", `Bearer ${responseLogin.body.token}`);
      expect(response.status).to.equal(200);
      expect(response.body.payload).to.have.lengthOf(10);
    });
    it();
  });
});
