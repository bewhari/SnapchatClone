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
      horizontalIndex: 1,
      verticalIndex: 1,
      horizontalScrollEnabled: true,

      mediaPath: null,
      mediaType: -1,

      isCapturingVideo: false,
      hideDashboardControls: false,

      captureVideoAnimation: new Animated.Value(0),
      captureButtonAnimation: new Animated.Value(0),

      scrollX: new Animated.Value(0),
    };

    this._onTouchStartCapture = this._onTouchStartCapture.bind(this);
    this._onHorizontalMomentumScrollEnd = this._onHorizontalMomentumScrollEnd.bind(this);
    this._onVerticalMomentumScrollEnd = this._onVerticalMomentumScrollEnd.bind(this);

    this._onSideIconPress = this._onSideIconPress.bind(this);
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

  _onPressOut() {
    if (this._captureVideoTimeout) {
      if (this.state.isCapturingVideo) {
        this._stopRecording();
      }
      this._clearVideoTimeout();
    } else {
      this.refs.camera.takePicture();
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
          index={this.state.horizontalIndex}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: this.state.scrollX}}}]
          )}
          scrollEventThrottle={16}
          onScrollBeginDrag={(e)=>console.log('_onScrollBeginDrag')}
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
          <DashboardControls
            startRecording={this._startRecording}
            isRecordingVideo={this.state.isCapturingVideo}
            hideDashboardControls={this.state.hideDashboardControls}
            onPressOut={this._onPressOut}
            onSideIconPress={this._onSideIconPress}
            scrollX={this.state.scrollX}
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
