import React, { Component } from 'react';
import { View, Platform, Text } from 'react-native';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class Header extends Component {
  render() {
    return (
      <View style={
        {
          backgroundColor: this.props.color ? this.props.color : '#CB3348',
          height: APPBAR_HEIGHT,
          width: null,
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 3
        }
      }>
        <View style={styles.titleContainer}>
          <Text
            style={
              {
                fontWeight: "500",
                fontSize: 20,
                color: this.props.titleColor ? this.props.titleColor : '#fff'
              }
            }>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
}

export { Header };

const styles = {
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
};