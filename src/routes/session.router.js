import { Router } from "express";
import { userModel } from "../dao/models/userModel.js";
const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  const user = await userModel.findOne({ email, password });
  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "credenciales incorrectas" });

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
  };
  res.send({ status: "success", payload: req.session.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (!error) {
      res.send("Logout OK!");
    } else {
      res.send({ status: "Logout ERROR!", body: error });
    }
  });
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const exists = await userModel.findOne({ email });
  if (exists) {
    return res
      .status(400)
      .send({ status: "error", error: "Ya existe usuario con ese email" });
  }
  const user = {
    first_name,
    last_name,
    email,
    age,
    password,
  };
  let result = await userModel.create(user);
  res.send({ status: "success", message: "User registered", newUser: result });
});

export default router;