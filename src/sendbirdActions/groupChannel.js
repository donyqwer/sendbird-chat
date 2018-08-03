import SendBird from 'sendbird';

export const sbCreateGroupChannelListQuery = () => {
  const sb = SendBird.getInstance();
  return sb.GroupChannel.createMyGroupChannelListQuery();
}

export const sbGetGroupChannelList = (groupChannelListQuery) => {
  return new Promise((resolve, reject) => {
    groupChannelListQuery.next((channels, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channels);
      }
    });
  });
}

export const sbGetGroupChannel = (channelUrl) => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channel);
      }
    })
  });
}

export const sbLeaveGroupChannel = (channelUrl) => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    sbGetGroupChannel(channelUrl)
    .then((channel) => {
      channel.leave((response, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      })
    })
    .catch((error) => reject(error));
  });
}

export const sbHideGroupChannel = (channelUrl) => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    sbGetGroupChannel(channelUrl)
    .then((channel) => {
      channel.hide((response, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      })
    })
    .catch((error) => reject(error));
  });
}

export const sbCreateUserListQuery = () => {
  const sb = SendBird.getInstance();
  return sb.createUserListQuery();
}

export const sbGetUserList = (userListQuery) => {
  return new Promise((resolve, reject) => {
    userListQuery.next((users, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(users);
      }
    });
  });   
}

export const sbCreateGroupChannel = (inviteUserIdList, isDistinct) => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    sb.GroupChannel.createChannelWithUserIds(inviteUserIdList, isDistinct, (channel, error) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(channel);
      }
    });
  });
}

export const sbInviteGroupChannel = (inviteUserIdList, channelUrl) => {
  return new Promise((resolve, reject) => {
    sbGetGroupChannel(channelUrl)
    .then((channel) => {
      channel.inviteWithUserIds(inviteUserIdList, (channel, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(channel);
        }
      });
    })
    .catch((error) => {
      reject(error);
    })
  })
}

export const sbCreateMetaDataGroupChannel = (channelUrl, metaData) => {
  return new Promise((resolve, reject) => {
    sbGetGroupChannel(channelUrl)
    .then((channel) => {
      channel.createMetaData(metaData, (response, error) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log('created data : ');
          console.log(response);
          resolve(response);
        }
      });
    })
    .catch((error) => {
      reject(error);
    })
  })
}

export const sbGetMetaDataGroupChannel = (channelUrl) => {
  return new Promise((resolve, reject) => {
    const metaData = ['chat_status', 'cb_session', 'cb_status', 'cb_last_context'];
    sbGetGroupChannel(channelUrl)
    .then((channel) => {
      channel.getMetaData(metaData, (data, error) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          if(data.cb_session){
            console.log('get data : ');
            console.log(data);
            resolve(data);
          }else{
            console.log('channel metadata is empty ');
            sbCreateMetaDataGroupChannel(channelUrl, { 
              cb_last_context: 'initiate',
              cb_status: '1',
              cb_session: channelUrl.substring(38),
              chat_status: '1'
            })
            .then((data) => {
              const initContext = [{
                name: "defaultwelcomeintent-followup",
                lifespan: 1
              }];
              sbUpdateMetaDataGroupChannel(channelUrl, { 
                cb_last_context: initContext,
                cb_status: '1',
                cb_session: channelUrl.substring(38),
                chat_status: '1'
              })
              .then((data) => resolve(data));
            })
          }
        }
      });
    })
    .catch((error) => {
      reject(error);
    })
  })
}

export const sbUpdateMetaDataGroupChannel = (channelUrl, metaData) => {
  return new Promise((resolve, reject) => {
    sbGetGroupChannel(channelUrl)
    .then((channel) => {
      channel.updateMetaData(metaData, (response, error) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log('updated data : ');
          console.log(response);
          resolve(response);
        }
      });
    })
    .catch((error) => {
      reject(error);
    })
  })
}