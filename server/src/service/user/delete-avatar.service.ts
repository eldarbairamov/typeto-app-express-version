import { User } from "../../model";
import { imageService } from "../image.service";

export const deleteAvatarService = async ( currentUserId: number ): Promise<void> => {

   const user = await User.findByPk( currentUserId );

   await imageService.delete( user?.email!, user?.image! );

   await user?.update( { image: null }, { hooks: false } );

};