import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../page/Login-Page/Login-Page.tsx";
import { RegistrationPage } from "../page/Registration-Page/Registration-Page.tsx";
import { ForgotPasswordPage } from "../page/Forgot-Password-Page/Forgot-Password-Page.tsx";

export const UnauthorizedRouter = createBrowserRouter([
   {
      path: "/",
      element: <LoginPage/>
   },
   {
      path: "/registration",
      element: <RegistrationPage/>
   },
   {
      path: "/forgot_password",
      element: <ForgotPasswordPage/>
   }
]);
