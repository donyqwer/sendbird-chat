import { 
  OPEN_CHANNEL_LIST_SUCCESS,
  OPEN_CHANNEL_LIST_FAIL
} from './types';
import { sbGetOpenChannelList, sbGetOpenChannel, sbOpenChannelExit } from '../sendbirdActions';

export const getOpenChannelList = (openChannelListQuery) => {
  return (dispatch) => {
    if (openChannelListQuery.hasNext) {
      sbGetOpenChannelList(openChannelListQuery)
      .then((channels) => dispatch({
        type: OPEN_CHANNEL_LIST_SUCCESS,
        list: channels
      }))
      .catch((error) => dispatch({ type: OPEN_CHANNEL_LIST_FAIL }))
    } else {
      dispatch({ type: OPEN_CHANNEL_LIST_FAIL });
    }
  }
}