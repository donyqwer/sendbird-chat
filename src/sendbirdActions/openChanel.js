import SendBird from 'sendbird';

export const sbCreateOpenChannelListQuery = () => {
  const sb = SendBird.getInstance();
  return sb.OpenChannel.createOpenChannelListQuery();
}

export const sbGetOpenChannel = (channelUrl) => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    sb.OpenChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channel);
      }
    })
  });
}

export const sbGetOpenChannelList = (openChannelListQuery) => {
  return new Promise((resolve, reject) => {
    openChannelListQuery.next((channels, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channels);
      }
    });
  });
}

export const sbOpenChannelEnter = (channel) => {
  return new Promise((resolve, reject) => {
    channel.enter((response, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channel);
      }
    });
  });
}

export const sbOpenChannelExit = (channel) => {
return new Promise((resolve, reject) => {
    channel.exit((response, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channel);
      }
    });
  });
}