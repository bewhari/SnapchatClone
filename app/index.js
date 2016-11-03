import React, { Component } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import Swiper from 'react-native-swiper';
import CameraView from './components/CameraView';
import CaptureView from './components/CaptureView';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

const VIDEO_LIMIT = 10000;

export default class App extends Component {
  constructor(props) {
    super(props);

    this._captureVideoTimeout = null;

    this.state = {
      horizontalIndex: 1,
      verticalIndex: 1,
      horizontalScrollEnabled: true,

      mediaPath: null,
      mediaType: -1,

      isCapturingVideo: 0,
      captureVideoAnimation: new Animated.Value(0),
      captureButtonAnimation: new Animated.Value(0),
    };

    this._onTouchStartCapture = this._onTouchStartCapture.bind(this);
    this._onHorizontalMomentumScrollEnd = this._onHorizontalMomentumScrollEnd.bind(this);
    this._onVerticalMomentumScrollEnd = this._onVerticalMomentumScrollEnd.bind(this);
    this._startRecording = this._startRecording.bind(this);
    this._stopRecording = this._stopRecording.bind(this);
    this._handleCapture = this._handleCapture.bind(this);
    this._cancelCapture = this._cancelCapture.bind(this);
    this._clearVideoTimeout = this._clearVideoTimeout.bind(this);
  }

  componentWillUnmount() {
    this._clearVideoTimeout();
  }

  _onTouchStartCapture(e, verticalState, verticalContext) {

  }

  _onHorizontalMomentumScrollEnd(e, horizontalState, horizontalContext) {
    this.setState({
      horizontalIndex: horizontalState.index,
    });
  }

  _onVerticalMomentumScrollEnd(e, verticalState, verticalContext) {
    this.setState({
      verticalIndex: verticalState.index,
      horizontalScrollEnabled: verticalState.index == 1,
    });
  }

  _startRecording() {
    this.refs.camera.startRecording();
    this._captureVideoTimeout = setTimeout(() => {
      this._stopRecording();
    }, VIDEO_LIMIT);
    Animated.timing(
      this.state.captureVideoAnimation, {
        toValue: 1,
        duration: 1000,
      }
    ).start();
    this.setState({isCapturingVideo: 1});
    this.refs.videoCaptureProgress.performLinearAnimation(100, VIDEO_LIMIT);
  }

  _stopRecording() {
    this.refs.camera.stopRecording();
    this.state.captureVideoAnimation.setValue(0);
    this.setState({isCapturingVideo: 0});
  }

  _handleCapture(data) {
    console.log(data);
    const parts = data.path.split('.');

    this.setState({
      mediaPath: data.path,
      mediaType: parts[parts.length-1] == 'jpg' ? 0 : 1,
    });
  }

  _cancelCapture() {
    this.setState({
      mediaPath: null,
      mediaType: -1,
    });
  }

  _clearVideoTimeout() {
    if (this._captureVideoTimeout) {
      clearTimeout(this._captureVideoTimeout);
      this._captureVideoTimeout = null;
    }
  }

  render() {
    return (
      <View>
        <Swiper
          loop={false}
          showsPagination={false}
          index={this.state.horizontalIndex}
          onMomentumScrollEnd={this._onHorizontalMomentumScrollEnd}
          scrollEnabled={this.state.horizontalScrollEnabled}
        >
          <View style={styles.container}>
            <Text>Left</Text>
          </View>

          <Swiper
            horizontal={false}
            loop={false}
            showsPagination={false}
            index={this.state.verticalIndex}
            onMomentumScrollEnd={this._onVerticalMomentumScrollEnd}
            onTouchStartCapture={this._onTouchStartCapture}
          >
            <View style={styles.container}>
              <Text>Top</Text>
            </View>

            <CameraView
              ref="camera"
              onCapture={this._handleCapture}
              hideStatusBar={this.state.horizontalIndex === 1 && this.state.verticalIndex === 1}
            />

            <View style={styles.container}>
              <Text>Bottom</Text>
            </View>
          </Swiper>

          <View style={styles.container}>
            <Text>Right</Text>
          </View>
        </Swiper>

        {
          this.state.mediaPath &&
            <CaptureView
              uri={this.state.mediaPath}
              type={this.state.mediaType}
              onCancel={this._cancelCapture}
              hideStatusBar={this.state.horizontalIndex === 1 && this.state.verticalIndex === 1}
            />
          ||
          <View style={[styles.overlay, styles.bottomOverlay]}>
            <TouchableWithoutFeedback
              onPressOut={() => {
                if (this._captureVideoTimeout) {
                  if (this.refs.camera.state.isRecording) {
                    this._stopRecording();
                    this._clearVideoTimeout();
                  } else {
                    this._captureVideoTimeout = null;
                  }
                } else {
                  this.refs.camera.takePicture();
                }
              }}
              delayLongPress={300}
              onLongPress={this._startRecording}
            >
              <View>
                <Animated.View
                  style={{
                    ...StyleSheet.flatten(styles.captureButton),
                    opacity: 1 - this.state.isCapturingVideo,
                  }}
                />

                <AnimatedCircularProgress
                  ref="videoCaptureProgress"
                  size={60}
                  width={4}
                  fill={this.state.isCapturingVideo}
                  rotation={0}
                  friction={10}
                  tension={100}
                  tintColor="red"
                  backgroundColor="white"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0,0,0,0)',
                    opacity: this.state.isCapturingVideo,
                    transform: [{
                      scale: this.state.captureVideoAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.3],
                      }),
                    }],
                  }}
                />

                <Animated.View
                  style={{
                    ...StyleSheet.flatten(styles.captureVideoButton),
                    opacity: this.state.captureVideoAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    transform: [{
                      scale: this.state.captureVideoAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.1, 1],
                      }),
                    }],
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        }

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
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: 'white',
  },
  captureVideoButton: {
    position: 'absolute',
    top: 7,
    left: 7,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 0,
    backgroundColor: 'red',
  },
});
