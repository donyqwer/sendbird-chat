import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class HorizontalRuler extends Component {
  render() {
    return (
      <View style={[styles.lineStyle, this.props.lineStyle]}></View>
    )
  }
}

const styles = StyleSheet.create({
  lineStyle: {
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 1,
    backgroundColor: '#e6e6e6'
  }
});

export { HorizontalRuler };
