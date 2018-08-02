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

  DIALOG_FLOW_CONECTED,
  DIALOG_FLOW_NOT_CONECTED,
  SEND_BOT_MESSAGE_SUCCESS,
  SEND_BOT_MESSAGE_FAIL,
  BOT_ENDED
} from './types';

import { 
  sbGetOpenChannel, 
  sbOpenChannelEnter, 
  sbGetChannelTitle,
  sbGetMessageList, 
  sbSendTextMessage,
  sbUserBlock ,
  sbGetGroupChannel,
  sbOpenChannelExit,
  sbTypingStart,
  sbTypingEnd,
  sbIsTyping,
  sbMarkAsRead,
  sendBotMessage,
  sbGetMetaDataGroupChannel,
  sbUpdateMetaDataGroupChannel,
  adminMessage
} from '../sendbirdActions';
import { dialogFlowQuery, dialogConnect } from '../dialogflowActions';

import SendBird from 'sendbird';

export const initChatScreen = () => {
  const sb = SendBird.getInstance();
  sb.removeAllChannelHandlers();
  return { type: INIT_CHAT_SCREEN }
}

export const getChannelTitle = (channelUrl, isOpenChannel) => {
  return (dispatch) => {
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl)
      .then((channel) => {
        dispatch({
          type: CHANNEL_TITLE_CHANGED,
          title: sbGetChannelTitle(channel),
          memberCount: channel.participantCount
        });
      })
      .catch((error) => { dispatch({ type: CHANNEL_TITLE_CHANGED_FAIL }) });
    } else {
      sbGetGroupChannel(channelUrl)
      .then((channel) => {
          dispatch({
            type: CHANNEL_TITLE_CHANGED,
            title: sbGetChannelTitle(channel),
            memberCount: channel.memberCount
          })
      })
      .catch((error) => {
        dispatch({ type: CHANNEL_TITLE_CHANGED_FAIL })
      })
    }
  }
}

export const getChannelMetaData = (channelUrl) => {
  return (dispatch) => {
    sbGetMetaDataGroupChannel(channelUrl)
    .then((data) => {
      dispatch({
        type: CHANNEL_META_DATA_RECEIVED,
        cb_session: data.cb_session,
        cb_status: data.cb_status,
        cb_last_context: data.cb_last_context? data.cb_last_context : [],
        chat_status: data.chat_status
      })
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: CHANNEL_META_DATA_NOT_RECEIVED })
    })
  }
}

export const connectToDialogFlow = (session) => {
  return (dispatch) => {
    dialogConnect(session);
    dispatch({ type: DIALOG_FLOW_CONECTED });
  }
}

export const createChatHandler = (channelUrl, isOpenChannel) => {
  return (dispatch) => {
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl) 
      .then((channel) => {
        sbOpenChannelEnter(channel)
        .then((channel) => { 
          registerOpenChannelHandler(channelUrl, dispatch); 
          dispatch({ type: CREATE_CHAT_HANDLER_SUCCESS });
        })
        .catch( (error) => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }) );
      })
      .catch( (error) => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }) );
    } else {
      sbGetGroupChannel(channelUrl)
      .then((channel) => {
        registerGroupChannelHandler(channelUrl, dispatch);
        dispatch({ type: CREATE_CHAT_HANDLER_SUCCESS });
      })
      .catch( (error) => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }) );
    }
  }
}

const registerCommonHandler = (channelHandler, channelUrl, dispatch) => {
  channelHandler.onMessageReceived = (channel, message) => {
    if (channel.url === channelUrl) {
      if (channel.isGroupChannel()) {
        sbMarkAsRead({ channel });
      }
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
}

const registerOpenChannelHandler = (channelUrl, dispatch) => {
  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();
  
  registerCommonHandler(channelHandler, channelUrl, dispatch);

  channelHandler.onUserEntered = (channel, user) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: CHANNEL_CHANGED,
        memberCount: channel.participantCount,
        title: channel.name
      })
    }
  }
  channelHandler.onUserExited = (channel, user) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: CHANNEL_CHANGED,
        memberCount: channel.participantCount,
        title: channel.name
      })
    }
  }

  sb.addChannelHandler(channelUrl, channelHandler);
}

const registerGroupChannelHandler = (channelUrl, dispatch) => {
  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();
  
  registerCommonHandler(channelHandler, channelUrl, dispatch);

  channelHandler.onUserJoined = (channel, user) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: CHANNEL_TITLE_CHANGED,
        title: sbGetChannelTitle(channel),
        memberCount: channel.memberCount
      });
    }
  }
  channelHandler.onUserLeft = (channel, user) => {
    if (channel.url === channelUrl) {
      dispatch({
        type: CHANNEL_TITLE_CHANGED,
        title: sbGetChannelTitle(channel),
        memberCount: channel.memberCount
      });
    }
  }
  channelHandler.onReadReceiptUpdated =  (channel) => { 
    if (channel.url === channelUrl) {
      dispatch({ type: READ_RECEIPT_UPDATED })
    }
  };
  channelHandler.onTypingStatusUpdated =  (channel) => { 
    if (channel.url === channelUrl) {
      const typing = sbIsTyping(channel);
      dispatch({ 
        type: TYPING_STATUS_UPDATED,
        typing: typing
      });
    }
  }; 

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

export const onSendButtonPress = (channelUrl, isOpenChannel, textMessage, sessionId, context, cb_status) => {
  return (dispatch) => {
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl)
      .then((channel) => {
        sendTextMessage(dispatch, channel, textMessage, sessionId, isOpenChannel, context, cb_status);
      })
      .catch( (error) => dispatch({ type: SEND_MESSAGE_FAIL }) )
    } else {
      sbGetGroupChannel(channelUrl)
      .then((channel) => {
        sendTextMessage(dispatch, channel, textMessage, sessionId, isOpenChannel, context, cb_status);
      })
      .catch( (error) => dispatch({ type: SEND_MESSAGE_FAIL }) )
    }
  }
}

const sendTextMessage = (dispatch, channel, textMessage, sessionId, isOpenChannel, context, cb_status) => {
  const messageTemp = sbSendTextMessage(channel, textMessage, (message, error) => {
    if (error) {
      dispatch({ type: SEND_MESSAGE_FAIL });
    } else {
      dispatch({ 
        type: SEND_MESSAGE_SUCCESS,
        message: message
      });
      if(!isOpenChannel && cb_status == 1){
        sendQueryToDialogFlow(dispatch, textMessage, sessionId, context, channel.url);
      }
    }
  });
  dispatch({
    type: SEND_MESSAGE_TEMPORARY,
    message: messageTemp
  });
}

export const onUserBlockPress = (blockUserId) => {
  return (dispatch) => {
    sbUserBlock(blockUserId)
    .then( (user) => dispatch({ type: USER_BLOCK_SUCCESS }) )
    .catch( (error) => dispatch({ type: USER_BLOCK_FAIL }) )
  }
}

export const typingStart = (channelUrl) => {
  return (dispatch) => {
    sbTypingStart(channelUrl)
    .then( (response) => dispatch({ type: SEND_TYPING_START_SUCCESS }) )
    .catch( (error) => dispatch({ type: SEND_TYPING_START_FAIL }) )
  }
}

export const typingEnd = (channelUrl) => {
  return (dispatch) => {
    sbTypingEnd(channelUrl)
    .then( (response) => dispatch({ type: SEND_TYPING_END_SUCCESS }) )
    .catch( (error) => dispatch({ type: SEND_TYPING_END_FAIL }) )
  }
}

export const channelExit = (channelUrl, isOpenChannel) => {
  return (dispatch) => {
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl)
      .then((channel) => {
        sbOpenChannelExit(channel)
        .then((response) => {
          dispatch({ type: CHANNEL_EXIT_SUCCESS });
        })
        .catch((error) => dispatch({ type: CHANNEL_EXIT_FAIL }))
      })
      .catch((error) => dispatch({ type: CHANNEL_EXIT_FAIL }))
    } else {
      const sb = SendBird.getInstance();
      sb.removeChannelHandler(channelUrl);
      dispatch({ type: CHANNEL_EXIT_SUCCESS });
    }
  }
}

const sendQueryToDialogFlow = (dispatch, message, sessionId, context, channelUrl) => {
  console.log(message);
  dialogFlowQuery(message, sessionId, context)
  .then((response) => response.result)
  .then((result) => {
    const msg = result.fulfillment.speech;
    const nextContext = result.contexts;

    console.log('msg: '+ msg);
    console.log( 'receive context :' );
    console.log(nextContext);
    console.log(nextContext[0].name + ' == end-interview');

    sendBotMessage(channelUrl, msg)
    .then(() => {
      if(nextContext[0].name == 'end-interview'){
        sbUpdateMetaDataGroupChannel(channelUrl, { 
          cb_last_context: nextContext,
          cb_status: 3
        });
        adminMessage(channelUrl, 'AIVI ended')
        dispatch({
          type: BOT_ENDED,
          payload: 3
        })
      }else {
        sbUpdateMetaDataGroupChannel(channelUrl, { cb_last_context: nextContext });
      }
      dispatch({
        type: SEND_BOT_MESSAGE_SUCCESS,
        payload: nextContext
      })
    })
    .catch(() => {
      dispatch({
        type: SEND_BOT_MESSAGE_FAIL,
        payload: context
      })
    })
  })
  .catch((error) => console.log(error));
}