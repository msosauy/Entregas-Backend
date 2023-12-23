import { userModel } from "../dao/models/userModel.js";
import { errMessage, handleError } from "../middlewares/errors/handleError.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { valueNotValid } from "../services/errors/info.js";
import { createHash, isValidPassword } from "../utils.js";
import { sendMailRestorePassword } from "./notification.controller.js";

export const restorePassword = async (req, res) => {
  const { email, password } = req.body;

  //Verificamos que password no esté vacío
  try {
    if (!password) {
      CustomError.createError({
        statusCode: 400,
        message: `clave ${errMessage.VALUE_MISS}`,
        cause: `Debe ingresar una clave nueva`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const user = await userModel.findOne({ email });

    //Verificamos que el usuario exista en la base de datos
    if (!user) {
      CustomError.createError({
        statusCode: 404,
        message: `${errMessage.SESSION_DON_EXIST}`,
        cause: `El correo ${email} no pertenece a ninguna cuenta`,
        code: EErrors.DATABASE_ERROR,
      });
    }

    //Validamos que no ingrese la misma contraseña
    if (isValidPassword(user, password)) {
      CustomError.createError({
        statusCode: 400,
        message: `${errMessage.SESSION_PASS_REPEAT}`,
        cause: `La clave no se puede repetir`,
        code: EErrors.DATABASE_ERROR,
      });
    }

    //Creamos la nueva contraseña y la guardamos en la base de datos
    const passwordHash = createHash(password);
    const response = await userModel.updateOne(
      { email },
      { $set: { password: passwordHash } }
    );
    if (response.acknowledged === true && response.modifiedCount === 1) {
      return res.status(200).send({
        status: "success",
        success: "Clave restablecida correctamente",
      });
    }
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause}`);
    handleError(error, req, res);
  }
};

export const requestRestorePassword = async (req, res) => {
  const email = req.body;
  const el = { name: "email", value: email.email };
  const type = "STRING";

  function validateEmail(email) {
    // Expresión regular para validar formato de correo electrónico
    var re = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    // let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  try {
    if (el.value === "") {
      CustomError.createError({
        statusCode: 400,
        message: `Email ${errMessage.VALUE_MISS}, no puede estar vacío`,
        cause: valueNotValid(el, type),
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    if (!validateEmail(email.email)) {
      CustomError.createError({
        statusCode: 400,
        message: `${errMessage.SESSION_MUST_BE_EMAIL}`,
        cause: `El correo ${email.email} no es formato de correo válido`,
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const user = await userModel.findOne({ email: email.email });
    if (!user) {
      CustomError.createError({
        statusCode: 404,
        message: `Email ${errMessage.SESSION_USER_NOT_FOUND}`,
        cause: `El correo ingresado no está asociado a una cuenta`,
        code: EErrors.DATABASE_ERROR,
      });
    }

    const sendEmail = await sendMailRestorePassword(user);

    if (sendEmail.rejected.length === 0) {
      res
        .status(200)
        .send({ status: "200", success: "Correo enviado correctamente" });
    }
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause}`);
    return handleError(error, req, res);
  }
};

export const validateMailTime = (requestDate) => {
  const actualDate = new Date();

  const compareMiliseconds = Math.abs(
    requestDate.getTime() - actualDate.getTime()
  );

  if (compareMiliseconds < 3600000) {
    return true;
  }
  return false;
};
