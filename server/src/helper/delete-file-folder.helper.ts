import { unlink } from "fs/promises";
import { ApiException } from "../exception";

export const deleteFileFolder = async ( path: string ): Promise<void> => {
   try {
      await unlink( path );
   }
   catch ( e ) {
      const error = e as Error;
      console.log( error.message );
      throw new ApiException( "Unlink: Error", 500 );
   }
};