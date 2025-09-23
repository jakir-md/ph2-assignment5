/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { EnvVars } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelper/AppError";

const transporter = nodemailer.createTransport({
  port: Number(EnvVars.SMTP_PORT),
  host: EnvVars.SMTP_HOST,
  secure: true,
  auth: {
    user: EnvVars.SMTP_USER,
    pass: EnvVars.SMTP_PASS,
  },
});

interface ISendMailOptions {
  to: string;
  templateName: string;
  subject: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendMail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendMailOptions) => {
  try {
    const templatePath = path.join(__dirname, `template/${templateName}`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: EnvVars.SMTP_FROM,
      to: to,
      subject,
      html: html,
      attachments: attachments?.map((attach) => ({
        filename: attach.filename,
        content: attach.content,
        contentType: attach.contentType,
      })),
    });
    console.log(`\u2709\uFE0F Email sent to ${to}:${info.messageId}`);
  } catch (error: any) {
    console.log(`Email Error: ${error.message}`);
    throw new AppError(401, "Email Error");
  }
};
