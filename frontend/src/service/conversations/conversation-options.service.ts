import { conversationAsyncActions } from "../../store/slice";
import { useAppDispatch } from "../../hook";
import { IConversation } from "../../interface";

export const conversationOptionsService = ( activeConversation: IConversation ) => {

   const dispatch = useAppDispatch();

   const deleteConversation = async () => dispatch(conversationAsyncActions.deleteConversation({ conversation: activeConversation }));

   const leaveGroupConversation = async () => dispatch(conversationAsyncActions.leaveGroupConversation({ conversation: activeConversation }));

   const deleteGroupConversation = async () => dispatch(conversationAsyncActions.deleteGroupConversation({ conversation: activeConversation }));

   return { deleteConversation, leaveGroupConversation, deleteGroupConversation };

};
