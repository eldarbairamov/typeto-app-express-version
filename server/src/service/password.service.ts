import bcrypt from "bcrypt";
import { ApiException } from "../exception";

export const passwordService = {

   passHasher: async ( dry: string ): Promise<string> => {
      try {
         return await bcrypt.hash( dry, 8 );

      }
      catch ( e ) {
         const error = e as Error;
         console.log( error.message );
         throw new ApiException( "Bcrypt: Hash error", 500 );
      }
   },

   passComparer: async ( dry: string, hashed: string ): Promise<boolean> => {
      try {
         return await bcrypt.compare( dry, hashed );

      }
      catch ( e ) {
         const error = e as Error;
         console.log( error.message );
         throw new ApiException( "Bcrypt: Compare error", 500 );
      }
   }
};