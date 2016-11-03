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

import Camera from 'react-native-camera';

export default class CameraView extends Component {
  static propTypes = {
    onCapture: PropTypes.func.isRequired,
    hideStatusBar: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.temp,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.off,
      },
      isRecording: false,
    };

    this.takePicture = this.takePicture.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this._switchType = this._switchType.bind(this);
    this._switchFlash = this._switchFlash.bind(this);
  }

  takePicture() {
    if (this.camera) {
      this.camera.capture()
        .then(data => {this.props.onCapture(data)})
        .catch(err => console.error(err));
    }
  }

  startRecording() {
    if (this.camera) {
      console.log('started recording');
      this.camera.capture({mode: Camera.constants.CaptureMode.video})
        .then(data => {this.props.onCapture(data)})
        .catch(err => console.error(err));

      this.setState({isRecording: true});
    }
  }

  stopRecording() {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({isRecording: false});
      console.log('stopped recording');
    }
  }

  _switchType() {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  get typeIcon() {
    return require('../../assets/ic-rotate-camera.png');
  }

  _switchFlash() {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = on;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === on) {
      icon = require('../../assets/ic-flash-on.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('../../assets/ic-flash-off.png');
    }

    return icon;
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={this.props.hideStatusBar} />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.camera}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          captureAudio={false}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          defaultTouchToFocus
          mirrorImage={false}
        />

        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={this._switchFlash}
          >
            <Image
              style={styles.icon}
              source={this.flashIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={this._switchType}
          >
            <Image
              style={styles.icon}
              source={this.typeIcon}
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
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
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
  icon: {
    width: 30,
    height: 30,
  },
  iconButton: {
    padding: 5,
  },
});
