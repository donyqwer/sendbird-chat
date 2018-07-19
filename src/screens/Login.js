import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initLogin, sendbirdLogin } from '../actions';
import { View, KeyboardAvoidingView, StyleSheet, Text, TextInput } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { Button, Spinner, StatusBar, LoginInput } from '../components/common';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      nickname: ''
    }
  }

  componentDidMount() {
    this.props.initLogin();
  }

  componentWillReceiveProps(props) {
    let { user, error } = props;
    if (user) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Menu' })
        ]
      });
      this.setState({ userId: '', nickname: '', isLoading: false }, () => {
        this.props.navigation.dispatch(resetAction);
      });
    }

    if (error) {
      this.setState({ isLoading: false });
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
    this.setState({ isLoading: true }, () => {
      this.props.sendbirdLogin({ userId, nickname });
    });
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <StatusBar color={'#000'}/>
        <Spinner visible={this.props.isLoading} />
        <View style={styles.content}>
          <View style={styles.logoViewStyle}>
            <Text style={styles.logoTextTitle}>ChatApp</Text>
            <Text style={styles.logoTextSubTitle}>React Native</Text>
          </View>

          <View style={styles.inputViewStyle}>
            <LoginInput
              placeholder={'User ID'}
              returnKeyType={'next'}
              onChangeText={this._userIdChanged}
              value={this.state.userId}
              autoCapitalize={'none'}
              underlineColorAndroid={'transparent'}
            />

            <LoginInput
              placeholder={'Nickname'}
              returnKeyType={'done'}
              onChangeText={this._nicknameChanged}
              value={this.state.nickname}
              autoCapitalize={'sentences'}
              underlineColorAndroid={'transparent'}
            />
          </View>

          <KeyboardAvoidingView
            style={{ alignItems: 'center' }}
            behavior={'position'}
            keyboardVerticalOffset={0}>
            <Button
              title='CONNECT'
              buttonStyle={styles.buttonStyle}
              onPress={this._onButtonPress}
              disabled={this.state.isLoading}
            />
          </KeyboardAvoidingView>
          
          <Text style={styles.errorTextStyle}>{this.props.error}</Text>

          <View style={[styles.footerViewStyle]}>
            <Text style={styles.footerTextStyle}>Sample ChatApp</Text>
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps({ login }) {
  const { isLoading, error, user } = login;
  return { isLoading, error, user };
};

export default connect(mapStateToProps, { sendbirdLogin, initLogin })(Login);

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#D13A42', 
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoViewStyle: {
    marginBottom: 20,
    alignItems: 'center'
  },
  logoTextTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 60,
  },
  logoTextSubTitle: {
    color: '#FFF',
    fontSize: 15,
    letterSpacing: 4,
  },
  inputViewStyle: {
    alignItems: 'center',
  },
  inputStyle: {
    fontSize:13,
    backgroundColor:'#fff'
  },
  buttonStyle: {
    height: 40,
    width: 250,
    margin: 10,
    borderRadius: 18,
    borderColor: '#fff',
    borderWidth: 2,
    padding: 3,
    alignItems: 'center',
    justifyContent:'center',
  },
  errorTextStyle: {
    alignSelf: 'center', 
    fontSize: 12, 
    color: '#f8e823'
  },
  footerViewStyle: {
    paddingLeft: 28,
    paddingRight: 28,
    marginTop: 15, 
    flexDirection: 'column'   
  },
  footerTextStyle: {
    alignSelf: 'center', 
    fontSize: 12, 
    color: '#fff'
  }
});
