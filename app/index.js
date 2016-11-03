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

      scrollX: new Animated.Value(0),
    };

    this._onTouchStartCapture = this._onTouchStartCapture.bind(this);
    this._onHorizontalMomentumScrollEnd = this._onHorizontalMomentumScrollEnd.bind(this);
    this._onVerticalMomentumScrollEnd = this._onVerticalMomentumScrollEnd.bind(this);

    this._onSideIconPress = this._onSideIconPress.bind(this);

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

  _onSideIconPress(index) {
    const offset = index - this.state.horizontalIndex;
    if (this.state.horizontalScrollEnabled) {
      this.refs.horizontalSwiper.scrollBy(offset, true);
    }
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
          ref="horizontalSwiper"
          loop={false}
          showsPagination={false}
          index={this.state.horizontalIndex}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.state.scrollX}}}]
          )}
          scrollEventThrottle={16}
          onScrollBeginDrag={(e)=>console.log('_onScrollBeginDrag', this.refs.horizontalSwiper.refs.scrollView.props.contentOffset.x)}
          onMomentumScrollEnd={()=>console.log('_onMomentumScrollEnd')}
          onTouchStartCapture={()=>console.log('_onTouchStartCapture')}
          onTouchStart={()=>console.log('_onTouchStart')}
          onTouchEnd={()=>console.log('_onTouchEnd')}
          onResponderRelease={()=>console.log('_onResponderRelease')}
          //onMomentumScrollEnd={this._onHorizontalMomentumScrollEnd}
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
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
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
                    size={70}
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
                      opacity: this.state.captureVideoAnimation,
                      transform: [{
                        scale: this.state.captureVideoAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      }],
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              opacity: 1 - this.state.isCapturingVideo,
            }}>
              <TouchableWithoutFeedback onPress={() => this._onSideIconPress(0)}>
                <Animated.Image
                  style={{
                    ...StyleSheet.flatten([styles.icon, styles.chatIcon]),
                    left: this.state.scrollX.interpolate({
                      inputRange: [0, 375, 750],
                      outputRange: [80, 0, 80],
                    }),
                    transform: [{
                      scale: this.state.scrollX.interpolate({
                        inputRange: [0, 375, 750],
                        outputRange: [0.8, 1, 0.8],
                      })
                    }],
                  }}
                  source={require('./assets/ic-chat.png')}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback>
                <Animated.View style={styles.memoriesButton} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => this._onSideIconPress(2)}>
                <Animated.View
                  style={{
                    ...StyleSheet.flatten(styles.icon),
                    right: this.state.scrollX.interpolate({
                      inputRange: [0, 375, 750],
                      outputRange: [80, 0, 80],
                    }),
                    transform: [{
                      scale: this.state.scrollX.interpolate({
                        inputRange: [0, 375, 750],
                        outputRange: [0.8, 1, 0.8],
                      })
                    }],
                  }}
                >
                  <View style={{
                    top: 2,
                    left: 7.5,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'white',
                  }} />
                  <View style={{
                    position: 'absolute',
                    bottom: 2,
                    left: 1,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'white',
                  }} />
                  <View style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 1,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'white',
                  }} />
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
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
    flex: 1,
    padding: 16,
    right: 0,
    left: 0,
  },
  bottomOverlay: {
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
  },
  captureVideoButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    backgroundColor: 'red',
  },
  memoriesButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'white',
  },
  icon: {
    width: 25,
    height: 25,
  },
  chatIcon: {
    width: 20,
    height: 20,
    margin: 2.5
  },
});
