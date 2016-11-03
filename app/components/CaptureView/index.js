import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Video from 'react-native-video';

export default class CaptureView extends Component {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    hideStatusBar: PropTypes.bool.isRequired,
  };

  render() {
    const { uri, type, onCancel } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar hidden={this.props.hideStatusBar} />
        {
          type == 0 && <Image style={styles.preview} source={{uri}} />
          ||
          type == 1 &&
            <Video
              source={{uri}}
              rate={1}
              volume={1}
              repeat={true}
              style={styles.preview}
            />
          ||
          <View style={styles.preview}>
            <Text>Media not recognized</Text>
          </View>
        }

        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onCancel}
          >
            <Image
              style={styles.icon}
              source={require('../../assets/ic-cancel-preview.png')}
            />
          </TouchableOpacity>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupTopRight]}
                source={require('../../assets/ic-notepad.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupTopRight]}
                source={require('../../assets/ic-text-tool.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupTopRight]}
                source={require('../../assets/ic-pencil.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.overlay, styles.bottomOverlay]}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupBottomLeft]}
                source={require('../../assets/ic-clock.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupBottomLeft]}
                source={require('../../assets/ic-save.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupBottomLeft]}
                source={require('../../assets/ic-add-story.png')}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={this.props.onCancel}
          >
            <Image
              style={styles.sendIcon}
              source={require('../../assets/ic-send.png')}
            />
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
  },
  preview: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 5,
  },
  icon: {
    width: 25,
    height: 25,
  },
  sendIcon: {
    width: 40,
    height: 40,
  },
  iconGroupTopRight: {
    marginLeft: 10,
  },
  iconGroupBottomLeft: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
