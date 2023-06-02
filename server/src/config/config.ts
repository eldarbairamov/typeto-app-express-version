import process from "process";

export const config = {
   PORT: process.env.PORT || 4000,

   EMAIL_SERVICE_USER: "typeto.application@gmail.com",
   EMAIL_SERVICE_PASS: "ngpbewfrdvhlwohv",

   SECRET_ACCESS_TOKEN_KEY: process.env.SECRET_ACCESS_TOKEN_KEY as string || "secret access token key",
   SECRET_REFRESH_TOKEN_KEY: process.env.SECRET_REFRESH_TOKEN_KEY as string || "secret access refresh key",
   SECRET_FORGOT_PASS_KEY: process.env.SECRET_FORGOT_PASS_KEY as string || "secret forgot pass key",
};
