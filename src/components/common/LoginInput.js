import React, { Component } from 'react';
import {  StyleSheet, TextInput } from 'react-native';

class LoginInput extends Component {
  render() {
    return (
      <TextInput
        style={styles.textInput}
        placeholder={this.props.placeholder}
        returnKeyType={this.props.returnKeyType}
        keyboardType={this.props.keyboardType}
        onChangeText={this.props.onChangeText}
        value={this.props.value}
        autoCapitalize={this.props.autoCapitalize}
        autoCorrect={false}
        maxLength={16}
        underlineColorAndroid={'transparent'} />
    )
  }
}

export { LoginInput };

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#ffffff',
    width: 250,
    height: 40,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 18,
    paddingLeft: 15,
    paddingRight: 15,
    textAlign: 'center'
  }
});