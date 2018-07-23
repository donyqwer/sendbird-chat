import { sbGetOpenChannel } from './openChanel';
import SendBird from 'sendbird';

export const sbCreatePreviousMessageListQuery = (channelUrl) => {
  return new Promise((resolve, reject) => {
    sbGetOpenChannel(channelUrl)
    .then( (channel) => resolve(channel.createPreviousMessageListQuery()) )
    .catch( (error) => reject(error) )
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
  return channel.sendUserMessage(textMessage, (message, error) => {
    callback(message, error);
  });
}
