import React, { Component } from 'react';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';
import { 
  initChatScreen,
  createChatHandler,
  onSendButtonPress,
  getPrevMessageList,
  channelExit,
} from '../actions';
import { MessageInput } from '../components/MessageInput';
import { Message } from '../components/Message';
import { TextItem } from '../components/MessageItem';
import { Button } from 'react-native-elements';
import { 
  sbGetOpenChannel,
  sbCreatePreviousMessageListQuery, 
  sbAdjustMessageList
} from '../sendbirdActions';

class Chat extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: `${params.title}`,
      headerLeft: (
        <Button 
          containerViewStyle={{marginLeft: 0, marginRight: 0}}
          buttonStyle={{paddingLeft: 14}}
          icon={{ name: 'chevron-left', type: 'font-awesome', color: '#7d62d9', size: 14 }}
          backgroundColor='transparent'
          onPress={() => { params.handleHeaderLeft() }}
        />
      )
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      previousMessageListQuery: null,
      textMessage: ''
    }
  }
  
  componentDidMount() {
    this.props.initChatScreen();
    this.props.navigation.setParams({ handleHeaderLeft: this._onBackButtonPress });
    
    const { channelUrl } = this.props.navigation.state.params;
    sbGetOpenChannel(channelUrl)
    .then((channel) => {
      this.props.navigation.setParams({ title: channel.name });
      this._componentInit();
    })
  }
  
  _componentInit = () => {
    const { channelUrl } = this.props.navigation.state.params;
    this.props.createChatHandler(channelUrl);
    this._getMessageList(true);
  }
  
  _onBackButtonPress = () => {
    const { channelUrl } = this.props.navigation.state.params;
    this.props.channelExit(channelUrl);
  }

  componentWillReceiveProps(props) {
    const { exit } = props;
    if (exit) {
      this.props.navigation.goBack();
    }
  }

  _onTextMessageChanged = (textMessage) => {
    this.setState({ textMessage });
  }

  _getMessageList = (init) => {
    if (!this.state.previousMessageListQuery && !init) {
      return;
    }
    const { channelUrl } = this.props.navigation.state.params;
    if (init) {
      sbCreatePreviousMessageListQuery(channelUrl)
      .then((previousMessageListQuery) => {
        this.setState({ previousMessageListQuery }, () => {
          this.props.getPrevMessageList(this.state.previousMessageListQuery);
        });
      })
      .catch((error) => this.props.navigation.goBack() );
    } else {
      this.props.getPrevMessageList(this.state.previousMessageListQuery);
    }
  }

  _onSendButtonPress = () => {
    if (this.state.textMessage) {
      const { channelUrl } = this.props.navigation.state.params;
      const { textMessage } = this.state;
      this.setState({ textMessage: '' }, () => {
        this.props.onSendButtonPress(channelUrl, textMessage);
        this.refs.chatSection.scrollTo({ y: 0 });
      });
    }
  }

  _renderList = (rowData) => {
    const { channel } = this.state;
    if (rowData.isUserMessage()) {
      return (
        <Message 
          key={rowData.messageId ? rowData.messageId : rowData.reqId}
          isShow={rowData.sender.isShow}
          isUser={rowData.isUser}
          profileUrl={rowData.sender.profileUrl.replace('http://', 'https://')}
          nickname={rowData.sender.nickname}
          time={rowData.time}
          message={(
            <TextItem 
              isUser={rowData.isUser}
              message={rowData.message}
            />
          )}
        />
      )
    } else { // FileMessage/AdminMessage
      return (<View></View>)
    }
  }

  render() {
    return (
      <View style={styles.containerViewStyle}>
        <View style={styles.messageListViewStyle}>
          <ListView
            ref='chatSection'
            enableEmptySections={true}
            renderRow={this._renderList}
            dataSource={this.props.list}
            onEndReached={() => this._getMessageList(false)}
            onEndReachedThreshold={-100}
          />
        </View>
        <View style={styles.messageInputViewStyle}>
          <MessageInput 
            onRightPress={this._onSendButtonPress}
            textMessage={this.state.textMessage}
            onChangeText={this._onTextMessageChanged}
          />
        </View>
      </View>
    )
  }
}

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
})

function mapStateToProps({ chat }) {
    const { exit } = chat;
    list = ds.cloneWithRows(sbAdjustMessageList(chat.list));
    return { list, exit }
}

export default connect(
    mapStateToProps, 
    { 
        initChatScreen,
        createChatHandler,
        onSendButtonPress,
        getPrevMessageList,
        channelExit
    }
)(Chat);

const styles = {
    renderTypingViewStyle: {
        flexDirection: 'row', 
        marginLeft: 14, 
        marginRight: 14, 
        marginTop: 4, 
        marginBottom: 0, 
        paddingBottom: 0,
        height: 14
    },
    containerViewStyle: {
        backgroundColor: '#fff', 
        flex: 1
    },
    messageListViewStyle: {
        flex: 10, 
        transform: [{ scaleY: -1 }]
    },
    messageInputViewStyle: {
        flex: 1, 
        marginBottom: 8, 
        flexDirection: 'column', 
        justifyContent: 'center'
    }
};