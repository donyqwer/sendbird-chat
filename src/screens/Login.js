import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendbirdLogin } from '../actions';
import { View, Text, StyleSheet } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements';
import StatusBar from '../components/common/StatusBar';
import SendBird from 'sendbird';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      nickname: ''
    }
  }

  componentWillReceiveProps(props) {
    const { user, error } = props;
    if (user) {
      this.setState({ userId: '', nickname: '' }, () => {
      this.props.navigation.navigate('Menu');
    })
  }
  }

  static navigationOptions = {
    header: null
  }

  _userIdChanged = (userId) => {
    this.setState({ userId });
  }

  _nicknameChanged = (nickname) => {
    this.setState({ nickname });
  }

  _onButtonPress = () => {
    const { userId, nickname } = this.state;
    const sb = new SendBird({ 'appId': 'CF31088F-09FA-4A6D-81A9-8B06685C8924' });
    sb.connect(userId, (user, error) => {
      if (error) {
        this.setState({ error });
      } else {
        sb.updateCurrentUserInfo(nickname, null, (user, error) => {
          if (error) {
            this.setState({ error });
          } else {
            this.setState({
              userId: '',
              nickname: '',
              error: ''
            }, () => {
              this.props.navigation.navigate('Menu');
            });
          }
        })
      }
    })
  }

  render() {
    return (
      <View>
        <StatusBar color={"rgba(0, 0, 0, 1)"} /> 
        <View style={styles.containerStyle}>
          <View style={styles.containerStyle}>
            <FormLabel>User ID</FormLabel>
            <FormInput
              value={this.state.userId}
              onChangeText={this._userIdChanged}
            />
          </View>
          <View style={styles.containerStyle}>
            <FormLabel>Nickname</FormLabel>
            <FormInput
              value={this.state.nickname}
              onChangeText={this._nicknameChanged}
            />
          </View>
          <View style={styles.containerStyle}>
              <Button
                onPress={this._onButtonPress}
                buttonStyle={{backgroundColor: '#2096f3'}}
                title='Connect' 
              />
          </View>
          <View style={styles.containerStyle}>
              <FormValidationMessage>{this.props.error}</FormValidationMessage>
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

function mapStateToProps({ login }) {
  const { error, user } = login;
  return { error, user };
};

export default connect(mapStateToProps, { sendbirdLogin })(Login);