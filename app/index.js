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

const VIDEO_LIMIT = 3000;

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

      captureVideoAnimation: new Animated.Value(0),
      captureButtonAnimation: new Animated.Value(0),
    };

    this._onTouchStartCapture = this._onTouchStartCapture.bind(this);
    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    this._handleCapture = this._handleCapture.bind(this);
    this._cancelCapture = this._cancelCapture.bind(this);
    this._clearVideoTimeout = this._clearVideoTimeout.bind(this);
  }

  componentWillUnmount() {
    this._clearVideoTimeout();
  }

  _onTouchStartCapture(e, verticalState, verticalContext) {

  }

  _onMomentumScrollEnd(e, verticalState, verticalContext) {
    this.setState({ horizontalScrollEnabled: verticalState.index == 1 });
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
            onMomentumScrollEnd={this._onMomentumScrollEnd}
            onTouchStartCapture={this._onTouchStartCapture}
          >
            <View style={styles.container}>
              <Text>Top</Text>
            </View>

            <CameraView ref="camera" onCapture={this._handleCapture} />

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
            />
          ||
          <View style={[styles.overlay, styles.bottomOverlay]}>
            <TouchableWithoutFeedback
              onPressOut={() => {
                if (this._captureVideoTimeout) {
                  if (this.refs.camera.state.isRecording) {
                    this.refs.camera.stopRecording();
                    this.state.captureVideoAnimation.setValue(0);
                    this._clearVideoTimeout();
                  } else {
                    this._captureVideoTimeout = null;
                  }
                } else {
                  this.refs.camera.takePicture();
                }
                /*
                Animated.timing(
                  this.state.captureButtonAnimation, {
                    toValue: 1,
                    friction: 1,
                  }
                ).start();
                //*/
              }}
              delayLongPress={300}
              onLongPress={() => {
                Animated.timing(
                  this.state.captureVideoAnimation, {
                    toValue: 1,
                  }
                ).start();
                this.refs.camera.startRecording();
                this._captureVideoTimeout = setTimeout(() => {
                  this.refs.camera.stopRecording();
                  this.state.captureVideoAnimation.setValue(0);
                }, VIDEO_LIMIT);
              }}
            >
              <View>
                <Animated.View
                  style={{
                    ...StyleSheet.flatten(styles.captureButton),
                    transform: [{
                      scale: this.state.captureButtonAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.5],
                      }),
                    }],
                    left: this.state.captureButtonAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                  }}
                />

                <Animated.View
                  style={{
                    ...StyleSheet.flatten(styles.captureVideoButton),
                    opacity: this.state.captureVideoAnimation.interpolate({
                      inputRange: [0, 0.1, 0.11],
                      outputRange: [0, 1, 1],
                    }),
                    transform: [{
                      scale: this.state.captureVideoAnimation.interpolate({
                        inputRange: [0, 0.1, 0.11],
                        outputRange: [0.1, 1, 1],
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
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
