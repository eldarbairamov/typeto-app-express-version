import { createBrowserRouter } from "react-router-dom";
import { ChatsPage } from "../page/Chats-Page/Chats-Page.tsx";
import { MainLayout } from "../layout/Main-Layout.tsx";
import { Error } from "../component";

export const AuthorizedRouter = createBrowserRouter([
   {
      path: "/",
      element: <MainLayout/>,
      children: [
         {
            index: true,
            element: <ChatsPage/>
         }
      ],
      errorElement: <Error/>
   },
]);
