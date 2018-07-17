import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import { Provider } from 'react-redux';
import store from './src/store';

import Login from './src/screens/Login';
import Menu from './src/screens/Menu';
import Profile from './src/screens/Profile';
import OpenChanel from './src/screens/OpenChanel';

const MainNavigator = createStackNavigator({
  Login: { screen: Login },
  Menu: { screen: Menu },
  Profile: { screen: Profile },
  OpenChanel: { screen: OpenChanel }
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