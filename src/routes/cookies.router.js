import { Router } from "express";

const router = Router();

const cookieName = "localCookie";

router.get("/setCookie", (req, res) => {
  res
    .cookie(cookieName, `Soy una cookie ${cookieName}`, {maxAge: 30000, signed: true})
    .send(`Soy una cookie llamada ${cookieName}`);
});

router.get('/getCookie', (req, res) => {
    res.send(req.signedCookies);
});

router.get('/deleteCookie', (req, res) => {
    res.clearCookie(cookieName).send(`Se eliminó la cookie ${cookieName}`);
});

export default router;