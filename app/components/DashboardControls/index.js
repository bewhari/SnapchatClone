import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import { VIDEO_LIMIT, VIDEO_PRESS_THRESHOLD } from '../../constants';

import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default class DashboardControls extends Component {
  static propTypes = {
    startRecording: PropTypes.func.isRequired,
    onPressOut: PropTypes.func.isRequired,
    isRecordingVideo: PropTypes.bool.isRequired,
    hideDashboardControls: PropTypes.bool.isRequired,
    animateDashboardOnHorizontalScroll: PropTypes.bool.isRequired,
    onSideButtonPress: PropTypes.func.isRequired,
    captureVideoAnimation: PropTypes.object.isRequired,
    scrollX: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._getSideButtonStyles = this._getSideButtonStyles.bind(this);
    this._getMemoriesButtonStyles = this._getMemoriesButtonStyles.bind(this);
    this._getCaptureButtonStyles = this._getCaptureButtonStyles.bind(this);
  }

  _getSideButtonStyles(left, presets, shouldAnimate, windowWidth, scrollX) {
    let style;
    if (shouldAnimate) {
      style = {
        ...presets,
        [left ? 'left' : 'right']: scrollX.interpolate({
          inputRange: [0, windowWidth, 2*windowWidth],
          outputRange: [0.2*windowWidth, 0, 0.2*windowWidth],
        }),
        transform: [{
          scale: scrollX.interpolate({
            inputRange: [0, windowWidth, 2*windowWidth],
            outputRange: [0.8, 1, 0.8],
          }),
        }],
      };
    } else {
      style = {
        ...presets,
        [left ? 'left' : 'right']: 0.2*windowWidth,
        transform: [{
          scale: 0.8,
        }],
      };
    }

    return style;
  }

  _getMemoriesButtonStyles(presets, shouldAnimate, windowWidth, scrollX) {
    let style;
    if (shouldAnimate) {
      style = {
        ...presets,
        top: scrollX.interpolate({
          inputRange: [0, windowWidth, 2*windowWidth],
          outputRange: [35, 0, 35],
        }),
        opacity: scrollX.interpolate({
          inputRange: [0, windowWidth, 2*windowWidth],
          outputRange: [0, 1, 0],
        }),
      };
    } else {
      style = {
        ...presets,
        top: 50,
        opacity: 0,
      };
    }

    return style;
  }

  _getCaptureButtonStyles(presets, shouldAnimate, windowWidth, scrollX) {
    let style;
    if (shouldAnimate) {
      style = {
        ...presets,
        top: scrollX.interpolate({
          inputRange: [0, windowWidth, 2*windowWidth],
          outputRange: [50, 0, 50],
        }),
        transform: [{
          scale: scrollX.interpolate({
            inputRange: [0, windowWidth, 2*windowWidth],
            outputRange: [0.6, 1, 0.6],
          }),
        }],
      };
    } else {
      style = {
        ...presets,
        top: 50,
        transform: [{
          scale: 0.6,
        }],
      }
    }

    return style;
  }

  render() {
    var { height, width } = Dimensions.get('window');

    return (
      <View style={[styles.overlay, styles.bottomOverlay]}>

        <View style={{
          ...StyleSheet.flatten(styles.navigatorContainer),
          opacity: this.props.hideDashboardControls ? 0 : 1,
        }}
        >
          <TouchableWithoutFeedback onPress={() => this.props.onSideButtonPress(0)}>
            <Animated.View
              style={this._getSideButtonStyles(
                true,
                StyleSheet.flatten(styles.sideButton),
                this.props.animateDashboardOnHorizontalScroll,
                width,
                this.props.scrollX
              )}
            >
              <View style={{
                position: 'absolute',
                top: 15,
                right: 7.5,
                width: 0,
                height: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderStyle: 'solid',
                borderLeftWidth: 7.5,
                borderTopWidth: 7.5,
                borderLeftColor: 'rgba(0,0,0,0)',
                borderTopColor: 'white'
              }}
              />
              <View style={{
                position: 'absolute',
                top: 2.5,
                left: 2.5,
                width: 15,
                height: 15,
                borderRadius: 3,
                backgroundColor: 'white',
              }}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <Animated.View
              style={this._getMemoriesButtonStyles(
                StyleSheet.flatten(styles.memoriesButton),
                this.props.animateDashboardOnHorizontalScroll,
                width,
                this.props.scrollX
              )}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.props.onSideButtonPress(2)}>
            <Animated.View
              style={this._getSideButtonStyles(
                false,
                StyleSheet.flatten(styles.sideButton),
                this.props.animateDashboardOnHorizontalScroll,
                width,
                this.props.scrollX
              )}
            >
              <View style={{
                position: 'absolute',
                top: 2,
                left: 7.5,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              />
              <View style={{
                position: 'absolute',
                bottom: 2,
                left: 1,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              />
              <View style={{
                position: 'absolute',
                bottom: 2,
                right: 1,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: 'white',
              }}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.captureButtonContainer}>
          <Animated.View
            style={this._getCaptureButtonStyles(
              {},
              this.props.animateDashboardOnHorizontalScroll,
              width,
              this.props.scrollX
            )}
          >
            <TouchableWithoutFeedback
              onPressOut={this.props.onPressOut}
              delayLongPress={VIDEO_PRESS_THRESHOLD}
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
                    ...StyleSheet.flatten(styles.captureVideoButtonOuter),
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
                    ...StyleSheet.flatten(styles.captureVideoButtonInner),
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
          </Animated.View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  captureButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navigatorContainer: {
    marginTop: 10,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
  },
  captureVideoButtonInner: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    backgroundColor: 'red',
  },
  captureVideoButtonOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  memoriesButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'white',
  },
  sideButton: {
    width: 25,
    height: 25,
  },
});
