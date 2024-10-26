const nodemailer = require("nodemailer");
require("dotenv").config();
const logger = require("../logger.js");

const welcomeTemplate = require("./templates/welcome.js");
const resetPasswordTemplate = require("./templates/resetPassword.js");
const otpTemplate = require("./templates/otpTemplate.js");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL, // change this to application's mail id
    pass: process.env.APP_EMAIL_KEY,
  },
});

async function sendMail(toAddress, templateName, data = {}) {
  try {
    let template;
    if (templateName == "Welcome") {
      template = welcomeTemplate(toAddress, data.password);
    } else if (templateName == "resetPassword") {
      template = resetPasswordTemplate(toAddress, data.password);
    } else if (templateName == "OTP") {
      template = otpTemplate(toAddress, data.otp);
    }
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // change this to application's mail id
      to: toAddress,
      subject: data.subject,
      html: template,
    });
    logger.info({ message: `[LOG]: Mail sent ${info.messageId}` });
    return info;
  } catch (err) {
    logger.error({ message: "Error occurred in emailGenerator", error: err });
    return err;
  }
}

module.exports = sendMail;
