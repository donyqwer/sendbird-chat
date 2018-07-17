import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import StatusBar from './common/StatusBar';

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <StatusBar color={"rgba(0, 0, 0, 1)"} /> 
        <View style={styles.containerStyle}>
          <View style={styles.containerStyle}>
            <FormLabel>User ID</FormLabel>
            <FormInput/>
          </View>
          <View style={styles.containerStyle}>
            <FormLabel>Nickname</FormLabel>
            <FormInput/>
          </View>
          <View style={styles.containerStyle}>
              <Button
                buttonStyle={{backgroundColor: '#2096f3'}}
                title='Connect' 
              />
          </View>
          <View style={styles.containerStyle}>
              <FormValidationMessage>Error message</FormValidationMessage>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    
  }
});