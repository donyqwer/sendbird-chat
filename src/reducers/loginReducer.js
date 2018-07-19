import { 
  INIT_LOGIN,
  LOGIN_START,
  LOGIN_SUCCESS, 
  LOGIN_FAIL 
} from '../actions/types';

const INITIAL_STATE = {
  isLoading: false,
  error: '',
  user: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_LOGIN: 
      return { ...state, ...INITIAL_STATE };
    case LOGIN_START: 
      return { ...state, ...INITIAL_STATE, isLoading: action.payload };
    case LOGIN_SUCCESS: 
      console.log(action.payload);
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case LOGIN_FAIL:
      return { ...state, ...INITIAL_STATE, error: action.payload };
    default: 
      return state;
  }
};
