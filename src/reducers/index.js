
import { combineReducers } from 'redux';
import login from './loginReducer';
import menu from './menuReducer';

export default combineReducers({
  login,
  menu
});