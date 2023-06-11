import { Outlet } from "react-router-dom";
import { Toast } from "../../component";
import { useAppSelector } from "../../hook";

export function UnauthorizedLayout() {
   const { actionMessage, actionType } = useAppSelector(state => state.appReducer);

   return (
       <>
          <Outlet/>
          <Toast actionMessage={ actionMessage }
                 actionType={ actionType }/>
       </>
   );
}