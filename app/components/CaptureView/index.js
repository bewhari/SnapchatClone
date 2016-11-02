import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
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
  };

  render() {
    const { uri, type, onCancel } = this.props;

    return (
      <View style={styles.container}>
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
            onPress={onCancel}
          >
            <Text style={{color: 'white'}}>X</Text>
          </TouchableOpacity>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={this.props.onCancel}
            >
              <Text style={{color: 'white'}}>E</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.props.onCancel}
            >
              <Text style={{color: 'white'}}>T</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.props.onCancel}
            >
              <Text style={{color: 'white'}}>C</Text>
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
              onPress={this.props.onCancel}
            >
              <Text style={{color: 'white'}}>L</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.props.onCancel}
            >
              <Text style={{color: 'white'}}>D</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.props.onCancel}
            >
              <Text style={{color: 'white'}}>S</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={this.props.onCancel}
          >
            <Text style={{color: 'white'}}>S</Text>
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
    backgroundColor: 'gray',
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
    alignItems: 'center',
  },
});
