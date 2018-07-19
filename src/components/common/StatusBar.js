import React, { Component } from 'react';
import Expo from 'expo';
import { View } from 'react-native';
import PropTypes from 'prop-types'

class StatusBar extends Component {
  render() {
    return (
      <View style={
        {
          backgroundColor: this.props.color,
          height: Expo.Constants.statusBarHeight, 
          width: null,
        }
      }/>
    );
  }
}

StatusBar.propTypes = {
  color: PropTypes.string.isRequired,
}

export { StatusBar };