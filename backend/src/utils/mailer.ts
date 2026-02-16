import { send } from "node:process";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER ,
    pass: process.env.SMTP_PASS 
  }
});

// Optional but very useful
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP connection failed:", err);
  } else {
    console.log("SMTP server is ready ✅");
  }
});

export async function sendEmail(email: string, subject: string, body: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Auth-system" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      text: body,
      html: `<b>${body}</b>`
    });

    console.log("Email sent successfully 🎉");
    console.log("Message ID:", info.messageId);
    return info;
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
}


