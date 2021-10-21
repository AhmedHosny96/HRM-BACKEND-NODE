const mailer = require("nodemailer");

module.exports = async (email, subject, html) => {
  try {
    //email transport

    const transport = mailer.createTransport({
      service: process.env.SERVICE,

      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transport.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.log("message not sent", error);
  }
};
