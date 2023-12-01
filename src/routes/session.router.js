import { Router } from "express";
import passport from "passport";
import { generateToken, authToken } from "../auth/authentication.js";
import  {restorePassword} from "../controllers/session.controller.js";
import UserDTO from "../dao/dto/userDTO.js";

const router = Router();

router.use((req, res, next) => {
  next();
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
    return res.status(200).send({
      status: "success",
      success: "Logueado correctamente",
      token: newToken,
    });
  }
);

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

//Register fail register
router.get("/failRegister", async (req, res) => {
  console.error("Fallo la estrategia");
  return res.send({ error: "Falló el registro" });
});

router.post("/restorepassword", restorePassword);

router.get("/profile", (req, res) => {
  res.send({ user: req.session.user });
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

export default router;
