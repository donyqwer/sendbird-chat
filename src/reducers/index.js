
import { combineReducers } from 'redux';
import login from './loginReducer';
import menu from './menuReducer';
import profile from './profileReducer';
import openChanel from './openChanel';
import chat from './chatReducer';

export default combineReducers({
  login,
  menu,
  profile,
  openChanel,
  chat
});