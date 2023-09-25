export const authUser = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/views/login");
  }
  next();
}

export const authAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/views/login");
  }
  if (req.session?.user.admin) {
    return next();
  }
  return res
    .status(401)
    .send({ status: "error", error: "No tienes permisos de administrador" });
};
