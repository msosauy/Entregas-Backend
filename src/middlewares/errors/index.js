import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({ status: "error", error: error.name, cause: error.cause });
      break;

    default:
        res.status(400).send({status: "error", error: "Error desconocido"})
      break;
  }
};
