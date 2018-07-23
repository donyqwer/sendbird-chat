
import { combineReducers } from 'redux';
import login from './loginReducer';
import menu from './menuReducer';
import profile from './profileReducer';
import openChanel from './openChanel';
import chat from './chatReducer';
import openChannelCreate from './openChannelCreateReducer';
import groupChannel from './groupChannelReducer';
import groupChannelInvite from './groupChannelInviteReducer';

export default combineReducers({
  login,
  menu,
  profile,
  openChanel,
  openChannelCreate,
  groupChannel,
  groupChannelInvite,
  chat
});