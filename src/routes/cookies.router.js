import { Router } from "express";

const router = Router();

const cookieName = "localCookie";

router.post("/setcookie/token", (req, res) => {
    const token = req.headers.authorization;
  res
    .cookie("authorization", token, {maxAge: 600000, signed: true})
    .send({status: "success"});
});

router.get('/getcookie', (req, res) => {
    res.send(req.signedCookies);
});

router.get('/deleteCookie', (req, res) => {
    res.clearCookie(cookieName).send({success: "success", message: `Se eliminó la cookie ${cookieName}`});
});

export default router;