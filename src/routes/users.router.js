import { Router } from "express";
import { userModel } from "../dao/models/userModel.js";
import CustomError from "../services/errors/CustomError.js";
import { errMessage, handleError } from "../middlewares/errors/handleError.js";
import EErrors from "../services/errors/enums.js";
import User from "../dao/mongodb/db.UserManager.js";
import { uploader } from "../utils.js";

const router = new Router();
const userDao = new User();

router.use((req, res, next) => {
  next();
});

//Cambia el rol del usuario a premium
router.get("/premium/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const requestUserRole = req.user.role;

    //Verificamos que el usuario que hace la petición sea administrador. Si no es así, devuelve el error.
    if (requestUserRole === "admin") {
      const editUser = await userModel.findById(uid);

      //Verificamos que el usuario exista
      if (!editUser) {
        CustomError.createError({
          statusCode: 404,
          message: errMessage.USER_NOT_EXIST,
          cause: `El usuario con ID: ${uid} no existe`,
          code: EErrors.DATABASE_ERROR,
        });
      }

      //Si el usuario ya es premium devuelve el error
      if (editUser.role === "premium") {
        CustomError.createError({
          statusCode: 400,
          message: errMessage.USER_ALREADY_PREMIUM,
          cause: `El usuario ${editUser.email} ya es premium`,
          code: EErrors.DATABASE_ERROR,
        });
      }

      editUser.role = "premium";
      editUser.save();
      res.status(200).send({
        status: "success",
        success: `El usuario ${editUser.email} es ahora PREMIUM`,
      });
    }
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause ? error.cause : ""}`);
    return handleError(error, req, res);
  }
});

//Obtiene un usuario por su ID
router.get("/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
    const user = await userDao.getUserById(uid);

    if (!user) {
      CustomError.createError({
        statusCode: 404,
        message: errMessage.USER_NOT_EXIST,
        cause: `El usuario con ID: ${uid} no existe`,
        code: EErrors.DATABASE_ERROR,
      });
    }

    res.status(200).send({
      status: "success",
      user,
    });
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause ? error.cause : ""}`);
    return handleError(error, req, res);
  }
});

router.post("/:uid/documents", uploader.single("file"), (req, res) => {
  const uid = req.params.uid;
  const file = req.file;

  try {
    if (!file) {
      CustomError.createError({
        statusCode: 400,
        message: errMessage.FILE_NOT_FOUND,
        cause: `Debe cargar un archivo`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    if (profiles) {

    }
    if (products) {
      
    }
    if (documents) {
    }

    res.status(200).send({
      status: "success",
      message: "Documento cargado correctamente",
    });
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause ? error.cause : ""}`);
    return handleError(error, req, res);
  }
});

export default router;
