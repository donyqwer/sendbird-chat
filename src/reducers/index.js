
import { combineReducers } from 'redux';
import login from './loginReducer';
import menu from './menuReducer';
import profile from './profileReducer';
import openChanel from './openChanel';

export default combineReducers({
  login,
  menu,
  profile,
  openChanel
});