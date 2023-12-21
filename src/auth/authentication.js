import jwt from "jsonwebtoken";

const PRIVATE_KEY = "KeyQueFuncionaComoSecret";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "12h" });
  return token;
};

export const authToken = async (req, res, next) => {

  if (!req.signedCookies) {
    return res
      .status(401)
      .send({ status: "error", error: "Not authenticated" });
  }

  const token = req.signedCookies.authorization;

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) {
      return res.status(403).send({ status: "error", error: "Not authorized" });
    }
    req.user = credentials.user;
    next();
  });
};

export const authUser = (req, res, next) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/views/login");
    }
    if (req.session?.user.role === "user") {
      return next();
    }
    return res.status(401).render("notUser", { style: "style.css" });
  } catch (error) {
    console.error("authUser", error);
  }
};

export const authPremium = (req, res, next) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/views/login");
    }
    if (req.session?.user.role === "premium" || req.session?.user.role === "admin") {
      return next();
    }
    return res.status(401).render("notAllowed", { style: "style.css" });
  } catch (error) {
    console.error("authPremium", error);
  }
};

export const authAdmin = (req, res, next) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/views/login");
    }
    if (req.session?.user.role === "admin") {
      return next();
    }
    return res.status(401).render("notAllowed", { style: "style.css" });
  } catch (error) {
    console.error("authAdmin", error);
  }
};
