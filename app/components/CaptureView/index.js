import React, { Component, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class CaptureView extends Component {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color: 'white'}}>Preview</Text>
        <Image source={{uri: this.props.uri}} />

        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity
            onPress={this.props.onCancel}
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
              <Text style={{color: 'white'}}>P</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'black',
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
});
