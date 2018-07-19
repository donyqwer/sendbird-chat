import React, { Component } from 'react';
import {  StyleSheet, Text, TouchableOpacity } from 'react-native';

class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={this.props.buttonStyle}>
        <Text 
          style={styles.buttonTitle}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    )
  }
}

export { Button };

const styles = StyleSheet.create({
  buttonTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});