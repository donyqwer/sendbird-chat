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
} from './types';
import { 
  sbGetOpenChannel, 
  sbOpenChannelEnter, 
  sbGetMessageList, 
  sbSendTextMessage,
  sbOpenChannelExit
} from '../sendbirdActions';
import SendBird from 'sendbird';

export const initChatScreen = () => {
  const sb = SendBird.getInstance();
  sb.removeAllChannelHandlers();
  return { type: INIT_CHAT_SCREEN }
}

export const createChatHandler = (channelUrl) => {
  return (dispatch) => {
    sbGetOpenChannel(channelUrl) 
    .then((channel) => {
      sbOpenChannelEnter(channel)
      .then((channel) => { 
        registerHandler(channelUrl, dispatch); 
        dispatch({ type: CREATE_CHAT_HANDLER_SUCCESS });
      })
      .catch( (error) => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }) );
    })
    .catch( (error) => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }) );
  }
}

const registerHandler = (channelUrl, dispatch) => {
  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();
  
  channelHandler.onMessageReceived = (channel, message) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: MESSAGE_RECEIVED,
        payload: message
      })
    }
  }
  channelHandler.onMessageUpdated = (channel, message) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: MESSAGE_UPDATED,
        payload: message
      })
    }
  }
  channelHandler.onMessageDeleted = (channel, messageId) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: MESSAGE_DELETED,
        payload: messageId
      })
    }
  }

  sb.addChannelHandler(channelUrl, channelHandler);
}

export const getPrevMessageList = (previousMessageListQuery) => {
    return (dispatch) => {
        if (previousMessageListQuery.hasMore) {
          sbGetMessageList(previousMessageListQuery)
          .then((messages) => {
            dispatch({
              type: MESSAGE_LIST_SUCCESS,
              list: messages
            });
          })
          .catch( (error) => dispatch({ type: MESSAGE_LIST_FAIL }) )
        } else {
          dispatch({ type: MESSAGE_LIST_FAIL });
        }
    }
}

export const onSendButtonPress = (channelUrl, textMessage) => {
  return (dispatch) => {
    sbGetOpenChannel(channelUrl)
    .then((channel) => {
      const messageTemp = sbSendTextMessage(channel, textMessage, (message, error) => {
        if (error) {
          dispatch({ type: SEND_MESSAGE_FAIL });
        } else {
          dispatch({ 
            type: SEND_MESSAGE_SUCCESS,
            message: message
          });
        }
      });
      dispatch({
        type: SEND_MESSAGE_TEMPORARY,
        message: messageTemp
      });
    })
    .catch( (error) => dispatch({ type: SEND_MESSAGE_FAIL }) )
  }
}

export const channelExit = (channelUrl) => {
  return (dispatch) => {
    sbGetOpenChannel(channelUrl)
    .then((channel) => {
      sbOpenChannelExit(channel)
      .then((response) => dispatch({ type: CHANNEL_EXIT_SUCCESS }))
      .catch((error) => dispatch({ type: CHANNEL_EXIT_FAIL }))
    })
    .catch((error) => dispatch({ type: CHANNEL_EXIT_FAIL }))
  }
}