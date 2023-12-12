import { Router } from "express";

const router = Router();
const cookieName = "localCookie";

router.use((req, res, next) => {
  next();
});


router.post("/setcookie/token", (req, res) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return res
      .status(400)
      .send({ status: "error", error: "No se recibió un token" });
  }
  const token = headerToken?.split(" ")[1];

  return res
    .cookie("authorization", token, { maxAge: 600000, signed: true })
    .send({ status: "success" });
});

router.get("/getcookie", (req, res) => {
  res.send(req.signedCookies);
});

router.get("/deleteCookie", (req, res) => {
  res
    .clearCookie(cookieName)
    .send({
      success: "success",
      message: `Se eliminó la cookie ${cookieName}`,
    });
});

export default router;
