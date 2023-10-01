import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jsonwt from "jsonwebtoken";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);
const PRIVATE_KEY_token = "tokenKey098!lp";

export const generateToken = (user) => {
  const token = jsonwt.sign({user}, PRIVATE_KEY_token, {expiresIn: "24h"})
  return token
}

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    return res.status(401).send({status: "error", error: "No autenticado"})
  }

  const token = authHeader.split(" ")[1];
  jsonwt.verify(token, PRIVATE_KEY_token, (error, credentials) => {
    if (error) {
      return res.status(403).send({status: "error", error: "No autorizado"})
    }
    req.user = credentials.user;
    next();
  })
}

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password); // recibe el password que envía el usuario y que está guardado en BBDD

export default __dirname;
