import React, { Component, PropTypes } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import { VIDEO_LIMIT } from '../../constants';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default class DashboardControls extends Component {
  static propTypes = {
    startRecording: PropTypes.func.isRequired,
    onPressOut: PropTypes.func.isRequired,
    isRecordingVideo: PropTypes.bool.isRequired,
    hideDashboardControls: PropTypes.bool.isRequired,
    onSideIconPress: PropTypes.func.isRequired,
    captureVideoAnimation: PropTypes.object.isRequired,
    scrollX: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      captureVideoAnimation: new Animated.Value(0),
    };
  }

  render() {
    return (
      <View style={[styles.overlay, styles.bottomOverlay]}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <TouchableWithoutFeedback
            onPressOut={this.props.onPressOut}
            delayLongPress={300}
            onLongPress={() => {
              this.props.startRecording();
              this.refs.videoCaptureProgress.performLinearAnimation(100, VIDEO_LIMIT);
            }}
          >
            <View>
              <Animated.View
                style={{
                  ...StyleSheet.flatten(styles.captureButton),
                  opacity: this.props.hideDashboardControls ? 0 : 1,
                }}
              />

              <AnimatedCircularProgress
                ref="videoCaptureProgress"
                size={70}
                width={4}
                fill={this.props.isRecordingVideo ? 0 : 1}
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
                  opacity: this.props.isRecordingVideo ? 1 : 0,
                  transform: [{
                    scale: this.props.captureVideoAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }),
                  }],
                }}
              />

              <Animated.View
                style={{
                  ...StyleSheet.flatten(styles.captureVideoButton),
                  opacity: this.props.captureVideoAnimation,
                  transform: [{
                    scale: this.props.captureVideoAnimation.interpolate({
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
          opacity: this.props.hideDashboardControls ? 0 : 1,
        }}>
          <TouchableWithoutFeedback onPress={() => this.props.onSideIconPress(0)}>
            <Animated.Image
              style={{
                ...StyleSheet.flatten([styles.icon, styles.chatIcon]),
                left: this.props.scrollX.interpolate({
                  inputRange: [0, 375, 750],
                  outputRange: [80, 0, 80],
                }),
                transform: [{
                  scale: this.props.scrollX.interpolate({
                    inputRange: [0, 375, 750],
                    outputRange: [0.8, 1, 0.8],
                  })
                }],
              }}
              source={require('../../assets/ic-chat.png')}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Animated.View style={styles.memoriesButton} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.props.onSideIconPress(2)}>
            <Animated.View
              style={{
                ...StyleSheet.flatten(styles.icon),
                right: this.props.scrollX.interpolate({
                  inputRange: [0, 375, 750],
                  outputRange: [80, 0, 80],
                }),
                transform: [{
                  scale: this.props.scrollX.interpolate({
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
    );
  }
}

const styles = {
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
};
