import EErrors from "../../services/errors/enums.js";

export const errorResponse = (error, req, res, next) => {
  res.send("funciona")
  // switch (error.code) {
  //   case EErrors.ROUTING_ERROR:
  //     res
  //       .status(400)
  //       .send({ status: "error", error: error.name, cause: error.cause });
  //     break;
  //   case EErrors.INVALID_TYPES_ERROR:
  //     res
  //       .status(422)
  //       .send({ status: "error", error: error.name, cause: error.cause });
  //     break;
  //   case EErrors.DATABASE_ERROR:
  //     res
  //       .status(400)
  //       .send({ status: "error", error: error.name });
  //     break;
  //   default:
  //     res.status(500).send({ status: "error", error: "Error desconocido" });
  //     break;
  // }
  next();
};
