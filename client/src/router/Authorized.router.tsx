import { createBrowserRouter } from "react-router-dom";
import { Error } from "../component";
import { AuthorizedLayout } from "../layout";
import { ChatsPage } from "../page";

export const AuthorizedRouter = createBrowserRouter([
   {
      path: "/",
      element: <AuthorizedLayout/>,
      children: [
         {
            index: true,
            element: <ChatsPage/>
         }
      ],
      errorElement: <Error/>
   },
]);
