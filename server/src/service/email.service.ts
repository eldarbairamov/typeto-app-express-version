import { EMAIL_TEMPLATES_PATH } from "../constant";
import path from "node:path";
import { ApiException } from "../exception";
import nodemailer from "nodemailer";
import { emailTemplate } from "../email-template/email-template";
import { config } from "../config";
import { EmailActionType } from "../type/email-action.type";
import hbs from "nodemailer-express-handlebars";

export const emailSender = async ( to: string, emailAction: EmailActionType, context: any ) => {
   const template = emailTemplate[emailAction];

   const transporter = nodemailer.createTransport({
      service: "gmail",
      from: "no reply",
      auth: {
         user: config.EMAIL_SERVICE_USER,
         pass: config.EMAIL_SERVICE_PASS,
      },
   });

   transporter.use("compile", hbs({
      viewEngine: {
         defaultLayout: "main",
         layoutsDir: path.join(EMAIL_TEMPLATES_PATH, "layout"),
         partialsDir: path.join(EMAIL_TEMPLATES_PATH, "partial"),
         extname: ".hbs",
      },
      extName: ".hbs",
      viewPath: path.join(EMAIL_TEMPLATES_PATH, "view"),
   }));

   const mail = {
      to,
      subject: template.subject,
      template: template.templateName,
      context,
   };

   return transporter
       .sendMail(mail)
       .catch(( e ) => {
          const error = e as Error;
          console.log(error.message);
          throw new ApiException("Nodemailer: Error", 500);
       });
};