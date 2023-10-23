import { userModel } from "../dao/models/userModel.js";
import { createHash } from "../utils.js";


export const restorePassword = async (req, res) => {
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
  }