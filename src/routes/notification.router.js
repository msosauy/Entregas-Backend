import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "uy.msosa@gmail.com",
    pass: "ifpp omlx zwzb rmoc",
  },
});

router.use((req, res, next) => {
  next();
});

router.get("/mail", async (req, res) => {
  const body = req.body;
  
  const result = await transport.sendMail({
    from: `Coder test <pruebacoder@yopmail.com>`,
    to: `pruebacoder1@yopmail.com`,
    subject: `Correo de prueba`,
    html: `
    <div>
      <h1>Esto es un correo de prueba</h1>
    </div>
    `,
    attachments: [],
  });
  res.send(result)
});

export default router;
