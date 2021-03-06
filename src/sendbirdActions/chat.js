import { sbGetOpenChannel } from './openChanel';
import { sbGetGroupChannel } from './groupChannel';
import { sbApiToken } from '../configs/sendbird';
import SendBird from 'sendbird';

const API_TOKEN = sbApiToken;

export const sbCreatePreviousMessageListQuery = (channelUrl, isOpenChannel) => {
  return new Promise((resolve, reject) => {
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl)
      .then( (channel) => resolve(channel.createPreviousMessageListQuery()) )
      .catch( (error) => reject(error) )
    } else {
      sbGetGroupChannel(channelUrl)
      .then( (channel) => resolve(channel.createPreviousMessageListQuery()) )
      .catch( (error) => reject(error) )
    }
  });
}

export const sbGetMessageList = (previousMessageListQuery) => {
  const limit = 30;
  const reverse = true;
  return new Promise((resolve, reject) => {
    previousMessageListQuery.load(limit, reverse, (messages, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(messages);
      }
    })
  });
}

export const sbSendTextMessage = (channel, textMessage, callback) => {
  if (channel.isGroupChannel()) {
    channel.endTyping();
  }
  return channel.sendUserMessage(textMessage, (message, error) => {
    callback(message, error);
  });
}

export const sbTypingStart = (channelUrl) => {
  return new Promise((resolve, reject) => {
    sbGetGroupChannel(channelUrl)
    .then((channel) => {
      channel.startTyping();
      resolve(channel);
    })
    .catch(reject(error));
  });
}

export const sbTypingEnd = (channelUrl) => {
  return new Promise((resolve, reject) => {
    sbGetGroupChannel(channelUrl)
    .then((channel) => {
      channel.endTyping();
      resolve(channel);
    })
    .catch(reject(error));
  });
}

export const sbIsTyping = (channel) => {
  if (channel.isTyping()) {
    const typingMembers = channel.getTypingMembers();
    if (typingMembers.length == 1) {
      return `${typingMembers[0].nickname} is typing...`;
    } else {
      return 'several member are typing...';
    }
  } else {
    return '';
  }
}

export const sbMarkAsRead = ({ channelUrl, channel }) => {
  if (channel) {
    channel.markAsRead();
  } else {
    sbGetGroupChannel(channelUrl)
    .then((channel) => channel.markAsRead());
  }
}

export const sendBotMessage = async (channel_url, message, onResult, onError) => {
  const DEFAULT_BASE_URL = 'https://api.sendbird.com/v3/bots/';
  const BOTS_NAME = '123rwwer32';

  const data = {
    "channel_url": channel_url,
    "message": message,
  };

  fetch(DEFAULT_BASE_URL + BOTS_NAME + '/send', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Api-Token': API_TOKEN,
      'charset': "utf-8"
    },
    body: JSON.stringify(data)
  })
  .then((response) => {
    var json = response.json().then(onResult)
  })
  .catch(onError);
};

export const adminMessage = async (channel_url, adminMsg, onResult, onError) => {
  const DEFAULT_BASE_URL = 'https://api.sendbird.com/v3/group_channels/';

  const data = {
    "message_type": "ADMM",
    "message": adminMsg,
    "custom_type": "entrance_message",
    "is_silent": true
  };

  fetch(DEFAULT_BASE_URL + channel_url + '/messages', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Api-Token': API_TOKEN,
      'charset': "utf-8"
    },
    body: JSON.stringify(data)
  })
  .then((response) => {
    var json = response.json().then(onResult)
  })
  .catch(onError);
};