import { DISCONNECT_SUCCESS, INIT_MENU } from './types';
import { sbDisconnect } from '../sendbirdActions';

export const initMenu = () => {
  return { type: INIT_MENU };
}

export const sendbirdLogout = () => {
  return (dispatch) => {
    sbDisconnect()
    .then(() => dispatch({ type: DISCONNECT_SUCCESS }));
  }
}