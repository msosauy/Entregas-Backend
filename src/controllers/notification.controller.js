import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "uy.msosa@gmail.com",
    pass: "ifpp omlx zwzb rmoc",
  },
});

export const sendMailPurchase = async (data) => {
  const result = await transport.sendMail({
    from: data.user.email,
    to: data.ticketData.purchaser,
    subject: `Tu orden ecommerce coder`,
    html: `
            <div>
              <h1>Compra confirmada</h1>
              <p>${data.ticketData.code}</p>
              <p>Fecha: ${data.ticketData.purchase_datetime}</p>
              <p>Total de la compra U$S${data.ticketData.amount}</p>
              <p></p>
            </div>
            `,
    attachments: [],
  });
  return result
};

export const sendMailRestorePassword = async (user) => {
  const result = await transport.sendMail({
    from: user.email,
    to: user.email,
    subject: `Recuperar contraseña`,
    html: `
            <div>
              <h1>Recuperar contraseña</h1>
              <p><a href="http://localhost:8080/views/restorepassword/${user.email}/${new Date()}">RECUPERAR CONTRASEÑA</a></p>
              <p></p>
            </div>
            `,
    attachments: [],
  });
  return result;
};