import React, { Component } from "react";
import { View, FlatList, Text, Alert, AsyncStorage, BackHandler, KeyboardAvoidingView } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import {
  openChannelProgress,
  groupChannelProgress,
  initChatScreen,
  getChannelTitle,
  createChatHandler,
  onSendButtonPress,
  getPrevMessageList,
  onUserBlockPress,
  typingStart,
  typingEnd,
  channelExit,
  getChannelMetaData,
  connectToDialogFlow
} from "../actions";
import { Button } from 'react-native-elements';
import { Spinner } from "../components/common";
import { BarIndicator } from "react-native-indicators";
import { TextItem, MessageInput, Message, AdminMessage } from '../components';
import { sbGetGroupChannel, sbGetOpenChannel, sbCreatePreviousMessageListQuery, sbAdjustMessageList, sbMarkAsRead } from "../sendbirdActions";

class Chat extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const _renderInviteButton = () => {
      return params.isOpenChannel ? null : (
        <Button
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          buttonStyle={{ paddingLeft: 0, paddingRight: 0 }}
          iconRight={{ name: "user-plus", type: "font-awesome", color: "#7d62d9", size: 18 }}
          backgroundColor="transparent"
          onPress={() => {
            navigation.navigate("GroupChannelInvite", {
              title: "Invite",
              channelUrl: params.channelUrl
            });
          }}
        />
      );
    };
    return {
      title: `${params.title}(${params.memberCount})`,
      headerLeft: (
        <Button
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          buttonStyle={{ paddingLeft: 14 }}
          icon={{ name: "chevron-left", type: "font-awesome", color: "#7d62d9", size: 18 }}
          backgroundColor="transparent"
          onPress={() => {
            params.handleHeaderLeft();
          }}
        />
      ),
      headerRight: (
        <View style={{ flexDirection: "row" }}>
          {_renderInviteButton()}
          <Button
            containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
            buttonStyle={{ paddingLeft: 4, paddingRight: 4 }}
            iconRight={{ name: "users", type: "font-awesome", color: "#7d62d9", size: 18 }}
            backgroundColor="transparent"
            onPress={() => {
              navigation.navigate("Member", { isOpenChannel: params.isOpenChannel, channelUrl: params.channelUrl });
            }}
          />
          <Button
            containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
            buttonStyle={{ paddingLeft: 0, paddingRight: 14 }}
            iconRight={{ name: "user-times", type: "font-awesome", color: "#7d62d9", size: 18 }}
            backgroundColor="transparent"
            onPress={() => {
              navigation.navigate("BlockUser");
            }}
          />
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    this.flatList = null;
    this.state = {
      channel: null,
      isLoading: false,
      previousMessageListQuery: null,
      textMessage: ""
    };
  }

  componentDidMount() {
    this.props.initChatScreen();
    this.props.navigation.setParams({ handleHeaderLeft: this._onBackButtonPress });
    const { channelUrl, isOpenChannel, isFromPayload } = this.props.navigation.state.params;
    this.props.getChannelMetaData(channelUrl);
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl).then(channel => this.setState({ channel }, () => this._componentInit()));
    } else {
      sbGetGroupChannel(channelUrl).then(channel => this.setState({ channel }, () => this._componentInit()));
    }

    BackHandler.addEventListener('hardwareBackPress', this._onBackButtonPress);
    if (isFromPayload) {
      AsyncStorage.removeItem("payload", () => {});
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._onBackButtonPress);
  }

  _componentInit = () => {
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
    this.props.openChannelProgress(false);
    this.props.groupChannelProgress(false);
    this.props.getChannelTitle(channelUrl, isOpenChannel);
    this.props.createChatHandler(channelUrl, isOpenChannel);
    this._getMessageList(true);
    if (!isOpenChannel) {
      sbMarkAsRead({ channelUrl });
    }
  };

  componentDidUpdate() {
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
    if (!isOpenChannel) {
      this.state.textMessage ? this.props.typingStart(channelUrl) : this.props.typingEnd(channelUrl);
    }
  }

  _onBackButtonPress = () => {
    const { channelUrl, isOpenChannel, _initListState } = this.props.navigation.state.params;
    if (_initListState) _initListState();
    this.setState({ isLoading: true }, () => {
      this.props.channelExit(channelUrl, isOpenChannel);
    });
    return true;
  };

  componentWillReceiveProps(props) {
    const { title, memberCount, list, exit, dialog_flow_status, cb_session } = props;
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;

    if (memberCount !== this.props.memberCount || title !== this.props.title) {
      const setParamsAction = NavigationActions.setParams({
        params: { memberCount, title },
        key: this.props.navigation.state.key
      });
      this.props.navigation.dispatch(setParamsAction);
    }

    if (list !== this.props.list) {
      this.setState({ isLoading: false });
    }

    if (exit) {
      this.setState({ isLoading: false }, () => {
        this.props.navigation.goBack();
      });
    }

    if(!dialog_flow_status && cb_session){
      props.connectToDialogFlow(cb_session);
    }
  }

  _onTextMessageChanged = textMessage => {
    this.setState({ textMessage });
  };

  _onUserBlockPress = userId => {
    Alert.alert("User Block", "Are you sure want to block user?", [{ text: "Cancel" }, { text: "OK", onPress: () => this.props.onUserBlockPress(userId) }]);
  };

  _getMessageList = init => {
    if (!this.state.previousMessageListQuery && !init) {
      return;
    }
    const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
    this.setState({ isLoading: true }, () => {
      if (init) {
        sbCreatePreviousMessageListQuery(channelUrl, isOpenChannel)
          .then(previousMessageListQuery => {
            this.setState({ previousMessageListQuery }, () => {
              this.props.getPrevMessageList(this.state.previousMessageListQuery);
            });
          })
          .catch(error => this.props.navigation.goBack());
      } else {
        this.props.getPrevMessageList(this.state.previousMessageListQuery);
      }
    });
  };

  _onSendButtonPress = () => {
    if (this.state.textMessage) {
      const { cb_last_context, cb_session } = this.props;
      console.log( 'sending context :' );
      console.log( cb_last_context );
      const { channelUrl, isOpenChannel } = this.props.navigation.state.params;
      const { textMessage } = this.state;
      this.setState({ textMessage: "" }, () => {
        this.props.onSendButtonPress(channelUrl, isOpenChannel, textMessage, cb_session, cb_last_context);
        if(this.props && this.props.list && this.props.list.length > 0) {
          this.flatList.scrollToIndex({
            index: 0,
            viewOffset: 0
          });
        }
      });
    }
  };

  _renderMessageItem = rowData => {
    const message = rowData.item;
    return <TextItem isUser={message.isUser} message={message.message} />;
  };

  _renderList = rowData => {
    const message = rowData.item;
    const { isOpenChannel } = this.props.navigation.state.params;
    const { channel } = this.state;
    if (message.isUserMessage()) {
      return (
        <Message
          key={message.messageId ? message.messageId : message.reqId}
          isShow={message.sender.isShow}
          isUser={message.isUser}
          profileUrl={message.sender.profileUrl.replace("http://", "https://")}
          onPress={() => this._onUserBlockPress(message.sender.userId)}
          nickname={message.sender.nickname}
          time={message.time}
          readCount={isOpenChannel || !channel ? 0 : channel.getReadReceipt(message)}
          message={this._renderMessageItem(rowData)}
        />
      );
    } else if (message.isAdminMessage()) {
      return <AdminMessage message={message.message} />;
    } else {
      return <View />;
    }
  };

  _renderTyping = () => {
    const { isOpenChannel } = this.props.navigation.state.params;
    return isOpenChannel ? null : (
      <View style={styles.renderTypingViewStyle}>
        <View style={{ opacity: this.props.typing ? 1 : 0, marginRight: 8 }}>
          <BarIndicator count={4} size={10} animationDuration={900} color="#cbd0da" />
        </View>
        <Text style={{ color: "#cbd0da", fontSize: 10 }}>{this.props.typing}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.containerViewStyle}>
        <Spinner visible={this.state.isLoading} />
        <View style={styles.messageListViewStyle}>
          <FlatList
            ref={elem => this.flatList = elem}
            renderItem={this._renderList}
            data={this.props.list}
            extraData={this.state}
            keyExtractor={(item, index) => item.messageId + ''}
            onEndReached={() => this._getMessageList(false)}
            onEndReachedThreshold={0}
          />
        </View>
        <KeyboardAvoidingView style={styles.messageInputViewStyle}
          behavior={'padding'}
          keyboardVerticalOffset={90}>
          {this._renderTyping()}
          <MessageInput
            onRightPress={this._onSendButtonPress}
            textMessage={this.state.textMessage}
            onChangeText={this._onTextMessageChanged}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

function mapStateToProps({ chat }) {
  let { title, memberCount, list, exit, typing, dialog_flow_status, botContext, cb_session, cb_status, cb_last_context, chat_status } = chat;
  list = sbAdjustMessageList(list);
  return { title, memberCount, list, exit, typing, dialog_flow_status, botContext, cb_session, cb_status, cb_last_context, chat_status };
}

export default connect(mapStateToProps, {
  openChannelProgress,
  groupChannelProgress,
  initChatScreen,
  getChannelTitle,
  createChatHandler,
  onSendButtonPress,
  getPrevMessageList,
  onUserBlockPress,
  typingStart,
  typingEnd,
  channelExit,
  getChannelMetaData,
  connectToDialogFlow
})(Chat);

const styles = {
  renderTypingViewStyle: {
    flexDirection: "row",
    marginLeft: 14,
    marginRight: 14,
    marginTop: 4,
    marginBottom: 0,
    paddingBottom: 0,
    height: 14
  },
  containerViewStyle: {
    backgroundColor: '#f1f2f6',
    flex: 1
  },
  messageListViewStyle: {
    flex: 10,
    transform: [{ scaleY: -1 }]
  },
  messageInputViewStyle: {
    flex: 1,
    marginBottom: 0,
    flexDirection: "column",
    justifyContent: "center"
  }
};
