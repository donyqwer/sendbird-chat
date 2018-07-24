import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import { Provider } from 'react-redux';
import store from './src/store';

import Login from './src/screens/Login';
import Menu from './src/screens/Menu';
import Profile from './src/screens/Profile';
import OpenChanel from './src/screens/OpenChanel';
import OpenChannelCreate from './src/screens/OpenChannelCreate';
import GroupChannel from './src/screens/GroupChannel';
import GroupChannelInvite from './src/screens/GroupChannelInvite';
import Chat from './src/screens/Chat';
import Member from './src/screens/Member';

const MainNavigator = createStackNavigator({
  Login: { screen: Login },
  Menu: { screen: Menu },
  Profile: { screen: Profile },
  OpenChanel: { screen: OpenChanel },
  OpenChannelCreate: { screen: OpenChannelCreate },
  GroupChannel: { screen: GroupChannel },
  GroupChannelInvite: { screen: GroupChannelInvite },
  Chat: { screen: Chat },
  Member: { screen: Member }
});

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    )
  }
}