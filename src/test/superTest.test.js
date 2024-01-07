import supertest from "supertest";
import * as chai from "chai";
import env from "../config/enviroment.config.js";

const PORT = env.port;
const expect = chai.expect;
const requester = supertest.agent(`http://localhost:${PORT}`);
const productToFind = 1;
const userUserLogin = { email: "user@user.com", password: "user098" };
const userPremiumLogin = { email: "premium@coder.com", password: "premium098" };
let responsePremiumLogin;
let responseUserLogin;

// describe("Testing USER", () => {
//   describe("Testing User Dao", () => {
//     it("Check existing user by _id property", async () => {
//       const response = await requester.get(
//         "/api/users/6552f16f7e512191f9ec4b72"
//       );
//       expect(response.status).to.equal(200);
//       expect(response.body.user).to.have.property("_id");
//     });
//   });
// });

// //test de productos
// describe("Testing PRODUCT", () => {
//   describe("Testing Product Dao", () => {
//     before(async function () {
//       responseUserLogin = await requester
//         .post("/session/login")
//         .send(userUserLogin);
//     });
//     it("Find a product by id and check if property _id exists", async () => {
//       const response = await requester
//         .get(`/api/products/${productToFind}`)
//         .set("authorization", `Bearer ${responseUserLogin.body.token}`);
//       expect(response.status).to.equal(200);
//       expect(response.body.success).to.have.property("_id");
//     });
//     it("GET paginated products", async () => {
//       const response = await requester
//         .get("/api/products")
//         .set("authorization", `Bearer ${responseUserLogin.body.token}`);
//       expect(response.status).to.equal(200);
//       expect(response.body.payload).to.have.lengthOf(10);
//     });
//     it("Create new product", async () => {
//       responsePremiumLogin = await requester
//         .post("/session/login")
//         .send(userPremiumLogin);
//       const productMock = {
//         title: "Producto de prueba",
//         description: "Producto de prueba",
//         code: "test",
//         price: 100,
//         status: true,
//         stock: 56,
//         category: "test",
//       };
//       const response = await requester
//         .post("/api/products")
//         .set("authorization", `Bearer ${responsePremiumLogin.body.token}`)
//         .send(productMock);
//       expect(response.status).to.equal(201);
//       expect(response.body.success).to.have.equals(
//         "Producto agregado correctamente"
//       );
//     });
//     it("Remove created product", async () => {
//       const productToDelete = await requester
//         .get("/api/products/code/test")
//         .set("authorization", `Bearer ${responsePremiumLogin.body.token}`);
//       const response = await requester
//         .delete(`/api/products/${productToDelete.body.success.id}`)
//         .set("authorization", `Bearer ${responsePremiumLogin.body.token}`);
//       expect(response.status).to.equal(200);
//       expect(response.body.success).to.have.equals(
//         "Producto eliminado correctamente"
//       );
//     });
//   });
// });

// //test de carrito
// describe("Testing CART", () => {
//   describe("Testing Cart Dao", () => {
//     let cartId;
//     before(async function () {
//       responseUserLogin = await requester
//         .post("/session/login")
//         .send(userUserLogin);
//     });
//     beforeEach(function () {
//       this.timeout(3000);
//     });
//     it("Create cart to user", async () => {
//       const response = await requester
//         .post("/api/carts")
//         .set("authorization", `Bearer ${responseUserLogin.body.token}`);
//       expect(response.status).to.equal(201);
//       expect(response.body).to.have.property("success");
//     });
//     it("Get cart from user", async () => {
//       const response = await requester
//         .get("/api/carts/getcartfromuser")
//         .set("authorization", `Bearer ${responseUserLogin.body.token}`);
//       cartId = response.body.payload.cartId;
//       expect(response.status).to.equal(200);
//       expect(response.body.payload).to.have.property("cartId");
//     });
//     it("Add product to cart", async () => {
//       const productToAdd = await requester
//         .post(`/api/carts/${cartId}/product/64f763fab18cecd041b01acc`)
//         .set("authorization", `Bearer ${responseUserLogin.body.token}`);
//       expect(productToAdd.status).to.equal(201);
//       expect(productToAdd.body.success).to.be.equals(
//         "Producto agregado correctamente"
//       );
//     });
//     it("Remove cart from user", async () => {
//       const response = await requester
//         .delete(`/api/carts/deletecartfromuser`)
//         .set("authorization", `Bearer ${responseUserLogin.body.token}`);
//       expect(response.status).to.equal(200);
//       expect(response.body.success).to.have.equals(
//         "Carrito eliminado correctamente"
//       );
//     });
//   });
// });

//test de session
describe("Testing SESSION", () => {
  describe("Testing Session Dao", () => {
    //LOGIN USER
    // it("Login user", async () => {
    //   const response = await requester
    //     .post("/session/login")
    //     .send(userUserLogin);
    //   expect(response.status).to.equal(200);
    //   expect(response.body).to.have.property("token");
    // });
    // //LOGOUT USER
    // it("Logout user", async () => {
    //   const response = await requester
    //     .get("/session/logout")
    //     .set("authorization", `Bearer ${responseUserLogin.body.token}`);
    //   expect(response.status).to.equal(200);
    //   expect(response.body.success).to.have.equals("Logout OK");
    // });
    // //LOGIN PREMIUM USER
    // it("Login premium user", async () => {
    //   const response = await requester
    //     .post("/session/login")
    //     .send(userPremiumLogin);
    //   expect(response.status).to.equal(200);
    //   expect(response.body).to.have.property("token");
    // });

    it("Debe loguear correctamente al usuario y devolver una cookie", async function () {
      const { headers } = await requester
        .post("/api/sessions/login")
        .send(userUserLogin);
      const cookieResult = headers["set-cookie"][0];
      console.log(cookieResult);
      expect(cookieResult).to.be.ok;
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.eql("connect.sid");
      expect(cookie.value).to.be.ok;
    });
  });
});
