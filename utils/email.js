const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1 sukurti transporteri
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b41b184d4dc6c9",
      pass: "1115b866bfeec2",
    },
  });
  // 2 define email options
  const mailOptions = {
    from: "skelbimai <skelbimai@skelbimai.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3 siusti email su nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
