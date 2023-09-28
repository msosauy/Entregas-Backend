import { Router } from "express";
import { userModel } from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales incorrectas" });

  if (!isValidPassword(user, password)) {
    return res
      .status(403)
      .send({ status: "error", error: "Contraseña incorrecta" });
  }
  delete user.password;
  req.session.user = user;
  return res.status(200).send({ status: "success", success: "Login OK!" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (!error) {
      res.status(200).send({ status: "success", success: "Logout OK" });
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
    password: createHash(password),
  };
  let result = await userModel.create(user);
  if (result) {
    return res.status(200).send({ status: "success", success: "ok" });
  }
});

router.post("/restorepassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ status: "error", error: "Faltan datos" });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .send({ status: "error", error: "El usuario no existe" });
  }

  const passwordHash = createHash(password);
  const response = await userModel.updateOne(
    { email },
    { $set: { password: passwordHash } }
  );
  if (response.acknowledged === true && response.modifiedCount === 1) {
    return res
      .status(200)
      .send({ status: "success", success: "Clave restablecida correctamente" });
  }
});

router.get("/profile", (req, res) => {
  res.send({ user: req.session.user });
});

export default router;
