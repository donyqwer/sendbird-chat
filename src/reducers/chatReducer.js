import { 
  INIT_CHAT_SCREEN,
  CREATE_CHAT_HANDLER_SUCCESS,
  CREATE_CHAT_HANDLER_FAIL,
  CHANNEL_TITLE_CHANGED,
  CHANNEL_TITLE_CHANGED_FAIL,
  MESSAGE_LIST_SUCCESS,
  MESSAGE_LIST_FAIL,
  SEND_MESSAGE_TEMPORARY,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  USER_BLOCK_SUCCESS,
  USER_BLOCK_FAIL,
  CHANNEL_EXIT_SUCCESS,
  CHANNEL_EXIT_FAIL,
  SEND_TYPING_START_SUCCESS,
  SEND_TYPING_START_FAIL,
  SEND_TYPING_END_SUCCESS,
  SEND_TYPING_END_FAIL,

  MESSAGE_RECEIVED,
  MESSAGE_UPDATED,
  MESSAGE_DELETED,
  CHANNEL_CHANGED,
  TYPING_STATUS_UPDATED,
  READ_RECEIPT_UPDATED,

  CHANNEL_META_DATA_RECEIVED,
  CHANNEL_META_DATA_NOT_RECEIVED,

  SEND_BOT_MESSAGE_SUCCESS,
  SEND_BOT_MESSAGE_FAIL,
  DIALOG_FLOW_CONECTED,
  DIALOG_FLOW_NOT_CONECTED,
  BOT_ENDED
} from '../actions/types';

const INITAL_STATE = {
  list: [],
  memberCount: 0,
  title: '',
  exit: false,
  typing: '',
  dialog_flow_status: false,
  cb_session: '',
  cb_status: '',
  cb_last_context: [],
  chat_status: ''
}

export default (state = INITAL_STATE, action) => {
  switch(action.type) {
    case INIT_CHAT_SCREEN: 
      return { ...state, ...INITAL_STATE };
    case CREATE_CHAT_HANDLER_SUCCESS:
      return { ...state }
    case CREATE_CHAT_HANDLER_FAIL:
      return { ...state }
    case CHANNEL_TITLE_CHANGED:
      return { ...state, title: action.title, memberCount: action.memberCount }
    case CHANNEL_TITLE_CHANGED_FAIL:
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
        if (message.reqId && newMessage.reqId && message.reqId.toString() === newMessage.reqId.toString()) {
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
    case CHANNEL_CHANGED:
      return { ...state, memberCount: action.memberCount, title: action.title }
    case TYPING_STATUS_UPDATED:
      return { ...state, typing: action.typing };
    case READ_RECEIPT_UPDATED:
      return { ...state, list: state.list };
    case DIALOG_FLOW_CONECTED: 
      return { ...state, dialog_flow_status: true };
    case DIALOG_FLOW_NOT_CONECTED:
      return { ...state, dialog_flow_status: false };
    case SEND_BOT_MESSAGE_SUCCESS: 
      return { ...state, cb_last_context: action.payload };
    case SEND_BOT_MESSAGE_FAIL: 
      return { ...state, cb_last_context: action.payload };
    case BOT_ENDED: 
      return { ...state, cb_status: action.payload };
    case CHANNEL_META_DATA_RECEIVED: 
      return { ...state, cb_session: action.cb_session, cb_status: action.cb_status, cb_last_context: action.cb_last_context, chat_status: action.chat_status };
    case CHANNEL_META_DATA_NOT_RECEIVED: 
      return { ...state };
    default:
      return state;
  }
}
