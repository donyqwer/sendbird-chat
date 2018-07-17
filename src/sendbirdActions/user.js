import SendBird from 'sendbird';
import { sendbirdApiID } from '../configs/sendbird';

const APP_ID = sendbirdApiID;

export const sbConnect = (userId, nickname) => {
  return new Promise((resolve, reject) => {
    const sb = new SendBird({ 'appId': APP_ID });
    sb.connect(userId, (user, error) => {
      if (error) {
        reject('SendBird Login Failed.');
      } else {
        sb.updateCurrentUserInfo(nickname, null, (user, error) => {
          if (error) {
            reject('Update User Failed.');
          } else {
            resolve(user);
          }
        })
      }
    })
  })
};