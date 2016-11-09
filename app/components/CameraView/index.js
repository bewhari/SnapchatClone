import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Swiper from 'react-native-swiper';
import Camera from 'react-native-camera';
import { BlurView } from 'react-native-blur';

export default class CameraView extends Component {
  static propTypes = {
    onCapture: PropTypes.func.isRequired,
    hideStatusBar: PropTypes.bool.isRequired,
    scrollIndex: PropTypes.number.isRequired,
    onScroll: PropTypes.func.isRequired,
    onTouchStartCapture: PropTypes.func.isRequired,
    onMomentumScrollEnd: PropTypes.func.isRequired,
    scrollAnimation: PropTypes.object.isRequired,
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

  _getBlurViewStyles(windowDimensions, scrollY) {
    const { width, height } = windowDimensions;
    return {
      position: 'absolute',
      width: width,
      backgroundColor: 'rgba(0,0,0,0.3)',
      opacity: scrollY.interpolate({
        inputRange: [0, 0.5*height, height, 1.5*height, 2*height],
        outputRange: [1, 1, 0, 1, 1],
      }),
    };
  }

  render() {
    const windowDimensions = Dimensions.get('window');
    const { width, height } = windowDimensions;

    return (
      <View style={styles.container}>
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
      >
      <Swiper
        horizontal={false}
        loop={false}
        showsPagination={false}
        index={this.props.scrollIndex}
        onScroll={this.props.onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={this.props.onMomentumScrollEnd}
      >
        <View style={styles.container}>
          <Animated.View
            style={{
              ...this._getBlurViewStyles(windowDimensions, this.props.scrollAnimation),
              top: 0,
            }}
          >
            <BlurView
              blurType="dark"
              blurAmount={10}
              style={{
                width: width,
                height: 2*height,
              }}
            >

            </BlurView>
          </Animated.View>
        </View>

        <View style={styles.container}>
          <StatusBar hidden={this.props.hideStatusBar} />

          <Animated.View
            style={{
              ...StyleSheet.flatten([styles.overlay, styles.topOverlay]),
              opacity: this.props.scrollAnimation.interpolate({
                inputRange: [0, 0.5*height, height, 1.5*height, 2*height],
                outputRange: [0, 0, 1, 0, 0],
              }),
            }}
          >
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
          </Animated.View>
        </View>

        <View
          style={{
            ...StyleSheet.flatten(styles.container),
            backgroundColor: 'skyblue',
          }}
        >
          <Animated.View
            style={{
              ...this._getBlurViewStyles(windowDimensions, this.props.scrollAnimation),
              top: -height,
            }}
          >
            <BlurView
              blurType="dark"
              blurAmount={10}
              style={{
                width: width,
                height: height,
              }}
            >
            </BlurView>
          </Animated.View>
          <Text>Bottom</Text>
        </View>
      </Swiper>
      </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
