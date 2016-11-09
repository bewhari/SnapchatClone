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
import DashboardControls from './components/DashboardControls';
import CameraView from './components/CameraView';
import CaptureView from './components/CaptureView';

import { VIDEO_LIMIT } from './constants';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      horizontalScrollIndex: 1,
      verticalScrollIndex: 1,
      horizontalScrollEnabled: true,

      mediaPath: null,
      mediaType: -1,

      isCapturingVideo: false,
      hideDashboardControls: false,
      animateDashboardOnHorizontalScroll: true,

      captureVideoAnimation: new Animated.Value(0),
      captureButtonAnimation: new Animated.Value(0),

      scrollAnimation: new Animated.ValueXY({x: 0, y: 0}),
    };

    this._onHorizontalTouchStartCapture = this._onHorizontalTouchStartCapture.bind(this);
    this._onHorizontalMomentumScrollEnd = this._onHorizontalMomentumScrollEnd.bind(this);
    this._onVerticalTouchStartCapture = this._onVerticalTouchStartCapture.bind(this);
    this._onVerticalMomentumScrollEnd = this._onVerticalMomentumScrollEnd.bind(this);

    this._scrollHorizontalTo = this._scrollHorizontalTo.bind(this);
    this._onPressOut = this._onPressOut.bind(this);

    this._startRecording = this._startRecording.bind(this);
    this._stopRecording = this._stopRecording.bind(this);
    this._handleCapture = this._handleCapture.bind(this);
    this._cancelCapture = this._cancelCapture.bind(this);
    this._clearVideoTimeout = this._clearVideoTimeout.bind(this);
  }

  componentWillUnmount() {
    this._clearVideoTimeout();
  }

  _onHorizontalTouchStartCapture(e, horizontalState, horizontalContext) {
    this.setState({
      animateDashboardOnHorizontalScroll: true,
    });
  }

  _onHorizontalMomentumScrollEnd(e, horizontalState, horizontalContext) {
    this.setState({
      horizontalScrollIndex: horizontalState.index,
    });
  }

  _onVerticalTouchStartCapture(e, horizontalState, horizontalContext) {
  }

  _onVerticalMomentumScrollEnd(e, verticalState, verticalContext) {
    this.setState({
      verticalScrollIndex: verticalState.index,
      horizontalScrollEnabled: verticalState.index == 1,
    });
  }

  _scrollHorizontalTo(index) {
    const offset = index - this.state.horizontalScrollIndex;
    //console.log('_scrollHorizontalTo: ', index, offset);
//*
    if (Math.abs(offset) == 2) {
      this.setState({animateDashboardOnHorizontalScroll: false});
      console.log('false');
    } else {
      this.setState({animateDashboardOnHorizontalScroll: true});
    }
//*/

    if (this.state.horizontalScrollEnabled) {
      this.refs.horizontalSwiper.scrollBy(offset, true);
    }
  }

  _onPressOut() {
    if (this.state.horizontalScrollIndex === 1 && this.state.verticalScrollIndex === 1) {
      if (this._captureVideoTimeout) {
        if (this.state.isCapturingVideo) {
          this._stopRecording();
        }
        this._clearVideoTimeout();
      } else {
        this.refs.camera.takePicture();
      }
    } else if (this.state.verticalScrollIndex === 1) {
      this._scrollHorizontalTo(1);
    } else {

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
    this.setState({
      isCapturingVideo: true,
      hideDashboardControls: true,
    });
  }

  _stopRecording() {
    this.refs.camera.stopRecording();
    this.state.captureVideoAnimation.setValue(0);
    this.setState({isCapturingVideo: false});
  }

  _handleCapture(data) {
    console.log(data);
    const parts = data.path.split('.');

    this.setState({
      mediaPath: data.path,
      mediaType: parts[parts.length-1] == 'jpg' ? 0 : 1,
      hideDashboardControls: true,
    });
  }

  _cancelCapture() {
    this.setState({
      mediaPath: null,
      mediaType: -1,
      hideDashboardControls: false,
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
          index={this.state.horizontalScrollIndex}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.state.scrollAnimation.x}}}]
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={this._onHorizontalMomentumScrollEnd}
          onTouchStartCapture={this._onHorizontalTouchStartCapture}
          scrollEnabled={this.state.horizontalScrollEnabled}
        >
          <View style={{
            ...StyleSheet.flatten(styles.container),
            backgroundColor: 'powderblue',
          }}
          >
            <Text>Left</Text>
          </View>

          <CameraView
            ref="camera"
            onCapture={this._handleCapture}
            hideStatusBar={this.state.horizontalScrollIndex === 1 && this.state.verticalScrollIndex === 1}
            scrollIndex={this.state.verticalScrollIndex}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.state.scrollAnimation.y}}}]
            )}
            onTouchStartCapture={this._onVerticalTouchStartCapture}
            onMomentumScrollEnd={this._onVerticalMomentumScrollEnd}
            scrollAnimation={this.state.scrollAnimation.y}
          />

          <View style={{
            ...StyleSheet.flatten(styles.container),
            backgroundColor: 'steelblue',
          }}
          >
            <Text>Right</Text>
          </View>
        </Swiper>

        {
          this.state.mediaPath &&
            <CaptureView
              uri={this.state.mediaPath}
              type={this.state.mediaType}
              onCancel={this._cancelCapture}
              hideStatusBar={this.state.horizontalScrollIndex === 1 && this.state.verticalScrollIndex === 1}
            />
          ||
          <DashboardControls
            startRecording={this._startRecording}
            isRecordingVideo={this.state.isCapturingVideo}
            hideDashboardControls={this.state.hideDashboardControls}
            animateOnHorizontalScroll={this.state.animateDashboardOnHorizontalScroll}
            onPressOut={this._onPressOut}
            onSideButtonPress={this._scrollHorizontalTo}
            scrollAnimation={this.state.scrollAnimation}
            captureVideoAnimation={this.state.captureVideoAnimation}
          />
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
});
