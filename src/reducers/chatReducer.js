import { 
  INIT_CHAT_SCREEN,
  CREATE_CHAT_HANDLER_SUCCESS,
  CREATE_CHAT_HANDLER_FAIL,
  MESSAGE_LIST_SUCCESS,
  MESSAGE_LIST_FAIL,
  SEND_MESSAGE_TEMPORARY,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  CHANNEL_EXIT_SUCCESS,
  CHANNEL_EXIT_FAIL,
  MESSAGE_RECEIVED,
  MESSAGE_UPDATED,
  MESSAGE_DELETED
} from '../actions/types';

const INITAL_STATE = {
  list: [],
  exit: false
}

export default (state = INITAL_STATE, action) => {
  switch(action.type) {
    case INIT_CHAT_SCREEN: 
      return { ...state, ...INITAL_STATE };
    case CREATE_CHAT_HANDLER_SUCCESS:
      return { ...state }
    case CREATE_CHAT_HANDLER_FAIL:
      return { ...state }
    case MESSAGE_LIST_SUCCESS:
      return { ...state, list: [...state.list, ...action.list] };
    case MESSAGE_LIST_FAIL:
      return { ...state };
    case SEND_MESSAGE_TEMPORARY:
      return { ...state, list: [...[action.message], ...state.list]}
    case SEND_MESSAGE_SUCCESS:
      const newMessage = action.message;
      const sendSuccessList = state.list.map((message) => {
        if (message.reqId.toString() === newMessage.reqId.toString()) {
          return newMessage;
        } else {
          return message;
        }
      })
      return { ...state, list: sendSuccessList }
    case SEND_MESSAGE_FAIL: 
      const newChatList = state.list.slice(1);
      return { ...state, list: newChatList }
    case CHANNEL_EXIT_SUCCESS:
      return { ...state, exit: true };
    case CHANNEL_EXIT_FAIL:
      return { ...state, exit: false };
    case MESSAGE_RECEIVED:
      return { ...state, list: [...[action.payload], ...state.list]}
    case MESSAGE_UPDATED:
      const updatedMessage = action.payload;
      const updatedList = state.list.map((message) => {
        if (message.messageId === updatedMessage.messageId) {
          message = updatedMessage
        }
        return message
      });
      return { ...state, list: updatedList }
    case MESSAGE_DELETED:
      const deletedList = state.list.filter((message) => {
        return message.messageId.toString() !== action.payload.toString();
      });
      return { ...state, list: deletedList }
    default:
      return state;
  }
}