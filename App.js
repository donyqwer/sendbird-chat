import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import Login from './component/screen/Login';
import Menu from './component/screen/Menu';

const MainNavigator = createStackNavigator({
  Login: { screen: Login },
  Menu: { screen: Menu }
});

export default class App extends Component {
  render() {
    return (
      <MainNavigator />
    )
  }
}