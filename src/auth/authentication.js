export const authUser = (req, res, next) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/views/login");
    }
    next();
  } catch (error) {
    console.error("authUser", error);
  }
};

export const authAdmin = (req, res, next) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/views/login");
    }
    if (req.session?.user.admin) {
      return next();
    }
    return res
      .status(401)
      .send({ status: "error", error: "No tienes permisos de administrador" });
  } catch (error) {
    console.error("authAdmin", error);
  }
};
