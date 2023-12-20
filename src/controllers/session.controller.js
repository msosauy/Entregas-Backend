import { userModel } from "../dao/models/userModel.js";
import { errMessage, handleError } from "../middlewares/errors/handleError.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { valueNotValid } from "../services/errors/info.js";
import { createHash } from "../utils.js";
import { sendMailRestorePassword } from "./notification.controller.js";

export const restorePassword = async (req, res) => {
  const _email = req.params.email;
  console.log(_email);
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
};

export const requestRestorePassword = async (req, res) => {
  const email = req.body;
  const el = { name: "email", value: email.email };
  const type = "STRING";

  function validateEmail(email) {
    // Expresión regular para validar un correo electrónico
    var re =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
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
    
    const user = await userModel.findOne({ email: email.email  });
    if (!user) {
      CustomError.createError({
        statusCode: 404,
        message: `Email ${errMessage.SESSION_USER_NOT_FOUND}`,
        cause: `El correo ingresado no está asociado a una cuenta`,
        code: EErrors.DATABASE_ERROR,
      });
    }

    const sendEmail = await sendMailRestorePassword(user);
    console.log(sendEmail);
  } catch (error) {
    req.logger.error(`${error.message} || ${error.cause}`);
    return handleError(error, req, res);
  }
};
