export const authAdmin = (req, res, next) => {
  if (req.session?.admin) {
    return next();
  }

  return res
    .status(401)
    .send({ status: "error", error: "No tienes permisos de administrador" });
};