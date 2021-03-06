import React, { Component } from 'react';
import { View, ListView, FlatList, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import {
  initOpenChannel,
  getOpenChannelList,
  onOpenChannelPress,
  clearCreatedOpenChannel,
  clearSeletedOpenChannel,
  openChannelProgress
} from '../actions'
import { Button } from 'react-native-elements';
import { ListItem, Avatar, Spinner } from '../components/common';
import { sbCreateOpenChannelListQuery } from '../sendbirdActions';

class OpenChanel extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: 'Open Channel',
      headerLeft: (
        <Button
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          buttonStyle={{ paddingLeft: 14 }}
          icon={{ name: 'chevron-left', type: 'font-awesome', color: '#7d62d9', size: 18 }}
          backgroundColor='transparent'
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: (
        <Button
          containerViewStyle={{ marginLeft: 0, marginRight: 0 }}
          buttonStyle={{ paddingRight: 14 }}
          iconRight={{ name: 'plus', type: 'font-awesome', color: '#7d62d9', size: 18 }}
          backgroundColor='transparent'
          onPress={() => { navigation.navigate('OpenChannelCreate') }}
        />
      )
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
      openChannelListQuery: null,
      list: [],
      openChannelList: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    this._initOpenChannelList();
  }

  componentWillReceiveProps(props) {
    const { list, channel, createdChannel } = props;
    if (createdChannel) {
      const newList = [...[createdChannel], ...list];
      this.setState({ list: newList }, () => {
        this.props.clearCreatedOpenChannel();
      });
    }
    if (channel) {
      this.props.clearSeletedOpenChannel();
      this.props.navigation.navigate(
        'Chat',
        {
          channelUrl: channel.url,
          title: channel.name,
          memberCount: channel.participantCount,
          isOpenChannel: channel.isOpenChannel(),
          _initListState: this._initEnterState
        }
      );
    }
  }

  _initEnterState = () => {
    this.setState({ enterChannel: false });
  }

  _initOpenChannelList = () => {
    this.props.initOpenChannel();
    this._getOpenChannelList(true);
  }

  _getOpenChannelList = (init) => {
    this.props.openChannelProgress(true);
    if (init) {
      const openChannelListQuery = sbCreateOpenChannelListQuery();
      this.setState({ openChannelListQuery }, () => {
        this.props.getOpenChannelList(this.state.openChannelListQuery);
      });
    } else {
      this.props.getOpenChannelList(this.state.openChannelListQuery);
    }
  }

  _onListItemPress = (channelUrl) => {
    if (!this.state.enterChannel) {
      this.setState({ enterChannel: true }, () => {
        this.props.onOpenChannelPress(channelUrl);
      })
    }
  }

  // _handleScroll = (e) => {
  //   if (e.nativeEvent.contentOffset.y < -100 && !this.state.refresh) {
  //     this.setState({ list: [], openChannelList: ds.cloneWithRows([]), refresh: true }, () => {
  //       this._initOpenChannelList();
  //     });
  //   }
  // }
  
  _renderList = (rowData) => {
    const channel = rowData.item;
    return (
      <ListItem
        component={TouchableHighlight}
        containerStyle={{ backgroundColor: '#fff' }}
        key={channel.url}
        avatar={(
          <Avatar
            source={{uri: channel.coverUrl}} 
          />
        )}
        title={channel.name.length > 30 ? channel.name.substring(0, 26) + '...' : channel.name}
        titleStyle={{ fontWeight: '500', fontSize: 16 }}
        subtitle={channel.participantCount + ' Participant'}
        subtitleStyle={{ fontWeight: '300', fontSize: 11 }}
        onPress={() => this._onListItemPress(channel.url)}
      />
    )
  }

  render() {
    return (
      <View>
        <Spinner visible={this.props.isLoading} />
        <FlatList
          renderItem={this._renderList}
          data={this.props.list}
          extraData={this.state}
          inverted={false}
          keyExtractor={(item, index) => item.url}
          onEndReached={() => this._getOpenChannelList(false)}
          onEndReachedThreshold={0}
        />
      </View>
    )
  }
}

const styles = {
};

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

function mapStateToProps({ openChanel })  {
  const { isLoading, list, createdChannel, channel } = openChanel;
  return { isLoading, list, createdChannel, channel };
}

export default connect(
  mapStateToProps,
  {
    initOpenChannel,
    getOpenChannelList,
    onOpenChannelPress,
    clearCreatedOpenChannel,
    clearSeletedOpenChannel,
    openChannelProgress
  }
)(OpenChanel);
