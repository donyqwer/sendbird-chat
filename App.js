import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import { Provider } from 'react-redux';
import store from './src/store';

import Login from './src/screens/Login';
import Menu from './src/screens/Menu';

const MainNavigator = createStackNavigator({
  Login: { screen: Login },
  Menu: { screen: Menu }
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