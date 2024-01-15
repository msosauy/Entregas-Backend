import { Router } from "express";
import passport from "passport";
import { generateToken, authToken } from "../auth/authentication.js";
import {
  requestRestorePassword,
  restorePassword,
} from "../controllers/session.controller.js";
import UserDTO from "../dao/dto/userDTO.js";
import { userModel } from "../dao/models/userModel.js";

const router = Router();

router.use((req, res, next) => {
  next();
});

router.get("/current", authToken, (req, res) => {
  const user = new UserDTO(req.user);
  res.status(200).send({ status: "success", user: user });
});

//Login fail login
router.get("/failLogin", (req, res) => {
  res.send({ error: "Failed login" });
});

//Github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

//githubcallback
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/views/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/views/products");
  }
);

router.get("/profile", (req, res) => {
  res.send({ user: req.session.user });
});

router.get("/logout", async (req, res) => {
  //resgistra la hora de desconexion en user.model last_connection
  const last_connection = await userModel.updateOne(
    { _id: req.user._id },
    { last_connection: new Date() }
  );
  req.session.destroy((error) => {
    if (!error) {
      res.status(200).send({ status: "success", success: "Logout OK" });
    } else {
      res.send({ status: "Logout ERROR!", body: error });
    }
  });
});

//Register fail register
router.get("/failRegister", async (req, res) => {
  console.error("Fallo la estrategia");
  return res.send({ error: "Falló el registro" });
});

//Login passport
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
    const newToken = generateToken(req.user);
    req.session.user = req.user;
    //resgistra la hora de conexion en user.model last_connection
    const last_connection = await userModel.updateOne(
      { _id: req.user._id },
      { last_connection: new Date() }
    );
    return res.status(200).send({
      status: "success",
      success: "Logueado correctamente",
      token: newToken,
    });
  }
);

//Register (si recibe false en el done pasa a failregister)
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    return res
      .status(200)
      .send({ status: "success", success: "Usuario registrado correctamente" });
  }
);

router.post("/updatepassword/", restorePassword);

router.post("/requestrestorepassword", requestRestorePassword);

export default router;
