import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';
import { sendbirdLogout, initMenu } from '../actions';
import { Spinner, HorizontalRuler, StatusBar, Header } from '../components/common';
import { createGroupChannel } from '../actions';
import { eventQuery } from '../dialogflowActions';

class Menu extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  componentWillMount() {
    this.props.initMenu();
  }

  componentWillReceiveProps(props) {
    const { channel } = props;
    
    AsyncStorage.getItem("user", (err, result) => {
      if(!result) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Login' })
          ]
        })
        this.props.navigation.dispatch(resetAction);
      }
    });

    if (channel) {
      this.setState({ isLoading: false }, () => {
        this.props.navigation.navigate('GroupChannel', { channel: channel, botInitiate: true })
      });
    }
  }

  _onDialogButtonPress = () => {
    this.setState({ isLoading: true }, () => {
      const isDistinct = true;
      this.props.createGroupChannel([], isDistinct);
    });
  }

  _onProfileButtonPress = () => {
    this.props.navigation.navigate({ routeName: 'Profile' })
  }

  _onOpenChannelPress = () => {
    this.props.navigation.navigate({ routeName: 'OpenChanel' })
  }

  _onGroupChannelPress = () => {
    this.props.navigation.navigate('GroupChannel', { channel: null, botInitiate: false })
  }

  _onDisconnectButtonPress = () => {
    this.setState({ isLoading: true }, () => {
      this.props.sendbirdLogout();
    });
  }

  render() {
    const mainColor = '#CB3348';
    return (
      <View style={styles.containerViewStyle}>
        <StatusBar color={'#000'} />
        <Header
          title={'Chat App'}/>
        <Spinner visible={this.state.isLoading} />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor='#fff'
          color={mainColor}
          icon={{name: 'user', type: 'font-awesome' , color: mainColor, size: 16}}
          title='Profile'
          onPress={this._onProfileButtonPress}
        />
        <HorizontalRuler />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor='#fff'
          color={mainColor}
          icon={{name: 'slack', type: 'font-awesome' , color: mainColor, size: 16}}
          title='Open Channel' 
          onPress={this._onOpenChannelPress}
        />
        <HorizontalRuler />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor='#fff'
          color={mainColor}
          icon={{name: 'users', type: 'font-awesome' , color: mainColor, size: 16}}
          title='Group Channel' 
          onPress={this._onGroupChannelPress}
        />
        <HorizontalRuler />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor='#fff'
          color='#7d62d9'
          color={mainColor}
          icon={{name: 'github-alt', type: 'font-awesome' , color: mainColor, size: 16}}
          title='Open AiVI'
          onPress={this._onDialogButtonPress}
        />
        <HorizontalRuler />
        <Button
          containerViewStyle={styles.menuViewStyle}
          buttonStyle={styles.buttonStyle}
          backgroundColor='#fff'
          color='#7d62d9'
          color={mainColor}
          icon={{name: 'sign-out', type: 'font-awesome' , color: mainColor, size: 16}}
          title='Disconnect' 
          onPress={this._onDisconnectButtonPress}
        />
        <HorizontalRuler />
      </View>
    )
  }
}

function mapStateToProps({ menu, groupChannelInvite }) {
  const { isDisconnected } = menu;
  const { channel } = groupChannelInvite;
  return { isDisconnected, channel };
};

export default connect(mapStateToProps, { sendbirdLogout, initMenu, createGroupChannel })(Menu);

const styles = {
  containerViewStyle: {
    backgroundColor: '#fff', 
    flex: 1
  },
  menuViewStyle: {
    marginLeft: 0,
    marginRight: 0
  },
  buttonStyle: {
    justifyContent: 'flex-start',
    paddingLeft: 14
  }
};