
import { combineReducers } from 'redux';
import login from './loginReducer';
import menu from './menuReducer';
import profile from './profileReducer';

export default combineReducers({
  login,
  menu,
  profile
});