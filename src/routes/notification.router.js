import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "uy.msosa@dmail.com",
    pass: "ifpp omlx zwzb rmoc",
  },
});

router.get("/mail", async (req, res) => {
  const result = await transport.sendMail({
    from: `Coder test <pruebacoder@yopmail.com>`,
    to: `pruebacoder@yopmail.com`,
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
