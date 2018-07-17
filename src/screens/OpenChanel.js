import React, { Component } from 'react';
import { View, ListView, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { getOpenChannelList } from '../actions'
import { ListItem, Avatar } from 'react-native-elements';
import { sbCreateOpenChannelListQuery } from '../sendbirdActions';

class OpenChanel extends Component {
  static navigationOptions = {
    title: 'OPEN CHANNEL'
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
    const { list } = props;

    if (list !== this.props.list) {
      if (list.length === 0) {
        this.setState({ list: [], openChannelList: ds.cloneWithRows([]) });    
      } else {
        const newList = [...this.state.list, ...list];
        this.setState({ list: newList, openChannelList: ds.cloneWithRows(newList) });
      }
    }
  }

  _initOpenChannelList = () => {
    this._getOpenChannelList(true);
  }

  _getOpenChannelList = (init) => {
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
    this.props.navigation.navigate(
      'Chat', 
      { channelUrl: channelUrl }
  );
  }

  _handleScroll = (e) => {
    if (e.nativeEvent.contentOffset.y < -100 && !this.state.refresh) {
      this.setState({ list: [], openChannelList: ds.cloneWithRows([]), refresh: true }, () => {
        this._initOpenChannelList();
      });
    }
  }
  
  _renderList = (rowData) => {
    return (
      <ListItem
        component={TouchableHighlight}
        containerStyle={{backgroundColor: '#fff'}}
        key={rowData.url}
        avatar={(
          <Avatar 
            source={{uri: rowData.coverUrl}} 
          />
        )}
        title={rowData.name.length > 30 ? rowData.name.substring(0, 26) + '...' : rowData.name}
        titleStyle={{fontWeight: '500', fontSize: 16}}
        onPress={ () => this._onListItemPress(rowData.url) }
      />
    )
  }

  render() {
    return (
      <View>
        <ListView
          enableEmptySections={true}
          renderRow={this._renderList}
          dataSource={this.state.openChannelList}
          onEndReached={() => this._getOpenChannelList(false)}
          onEndReachedThreshold={-50}
          onScroll={this._handleScroll}
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
  const { list } = openChanel;
  return { list };
}

export default connect(mapStateToProps, { getOpenChannelList })(OpenChanel);