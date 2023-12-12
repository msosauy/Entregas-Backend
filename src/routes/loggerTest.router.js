import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  next();
});

//No es necesario estar logueado
router.get("/", (req, res) => {
  req.logger.fatal("log level: fatal");
  req.logger.error("log level: error");
  req.logger.warning("log level: warning");
  req.logger.info("log level: info");
  req.logger.http("log level: debug");
  req.logger.debug("log level: debug");
  res.send("Test de logger ejecutado correctamene!!");
});

export default router;
