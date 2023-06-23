import { access } from "fs/promises";

export const isFolderExists = async ( path: string ): Promise<true | false> => {
   try {
      await access( path );
      return true;
   }
   catch ( e ) {
      return false;
   }
};