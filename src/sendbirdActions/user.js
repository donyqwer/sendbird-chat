import SendBird from 'sendbird';
import { AsyncStorage } from 'react-native';
import { sendbirdApiID } from '../configs/sendbird';

const APP_ID = sendbirdApiID;

export const sbConnect = (userId, nickname) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject('UserID is required.');
      return;
    }
    if (!nickname) {
      reject('Nickname is required.');
      return;
    }
    const sb = new SendBird({'appId': APP_ID});
    sb.connect(userId, (user, error) => {
      if (error) {
        reject('SendBird Login Failed.');
      } else {
        resolve(sbUpdateProfile(nickname));
      }
    })
  })
};

export const sbUpdateProfile = (nickname) => {
  return new Promise((resolve, reject) => {
    if (!nickname) {
      reject('Nickname is required.');
      return;
    }
    let sb = SendBird.getInstance();
    if(!sb) sb = new SendBird({'appId': APP_ID});
    sb.updateCurrentUserInfo(nickname, null, (user, error) => {
      if (error) {
        reject('Update profile failed.')
      } else {
        AsyncStorage.setItem('user', JSON.stringify(user), () => {
          resolve(user);
        });
      }
    })
  })
}

export const sbDisconnect = () => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    if (sb) {
      sb.disconnect(() => {
        resolve(null);
      });
    } else {
      resolve(null);
    }
  })
};

export const sbGetCurrentInfo = () => {
  const sb = SendBird.getInstance();
  if(sb.currentUser) {
    return {
        profileUrl: sb.currentUser.profileUrl,
        nickname: sb.currentUser.nickname
    }
  }
  return {};
}