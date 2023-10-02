import { Router } from "express";
import { userModel } from "../dao/models/userModel.js";
import { createHash } from "../utils.js";
import passport from "passport";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales invalidas" });
    }
    delete req.user.password;
    req.session.user = req.user;
    return res
      .status(200)
      .send({ status: "success", success: "Logueado correctamente" });
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/views/login"}), async (req, res) => {
  req.session.user = req.user;
  res.redirect("/views/products");
})

router.get("/failLogin", (req, res) => {
  res.send({ error: "Failed login" });
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
//si recibe false en el done pasa a failregister
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    return res
      .status(200)
      .send({ status: "success", success: "Usuario registrado correctamente" });
  }
);

router.get("/failRegister", async (req, res) => {
  console.error("Fallo la estrategia");
  return res.send({ error: "Falló el registro" });
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
