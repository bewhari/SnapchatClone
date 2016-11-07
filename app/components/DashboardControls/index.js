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
    animateOnHorizontalScroll: PropTypes.bool.isRequired,
    onSideButtonPress: PropTypes.func.isRequired,
    captureVideoAnimation: PropTypes.object.isRequired,
    scrollAnimation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // this._getSideButtonHorizontalStyles = this._getSideButtonHorizontalStyles.bind(this);
    // this._getSideButtonVerticalStyles = this._getSideButtonVerticalStyles.bind(this);
    // this._getMemoriesButtonHorizontalStyles = this._getMemoriesButtonHorizontalStyles.bind(this);
    // this._getMemoriesButtonVerticalStyles = this._getMemoriesButtonVerticalStyles.bind(this);
    // this._getCaptureButtonHorizontalStyles = this._getCaptureButtonHorizontalStyles.bind(this);
    // this._getCaptureButtonVerticalStyles = this._getCaptureButtonVerticalStyles.bind(this);
  }

  _getSideButtonHorizontalStyles(left, presets, animateOnHorizontalScroll, windowWidth, scrollX) {
    let style;

    if (animateOnHorizontalScroll) {
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

  _getSideButtonVerticalStyles(left, presets, windowDimensions, scrollY) {
    const { width, height } = windowDimensions;
    return {
      ...presets,
      [left ? 'left' : 'right']: scrollY.interpolate({
        inputRange: [0, height, 2*height],
        outputRange: [0.2*width, 0, 0.2*width],
      }),
      transform: [{
        scale: scrollY.interpolate({
          inputRange: [0, 0.5*height, height, 1.5*height, 2*height],
          outputRange: [0.8, 0.8, 1, 0.8, 0.8],
        }),
      }],
    }
  }

  _getMemoriesButtonHorizontalStyles(presets, windowWidth, animateOnHorizontalScroll, scrollX) {
    let style;

    if (animateOnHorizontalScroll) {
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

  _getMemoriesButtonVerticalStyles(presets, windowDimensions, scrollY) {
    const { width, height } = windowDimensions;
    return {
      ...presets,
      top: scrollY.interpolate({
        inputRange: [0, height, 2*height],
        outputRange: [35, 0, 35],
      }),
    };
  }

  _getCaptureButtonHorizontalStyles(presets, windowWidth, animateOnHorizontalScroll, scrollX) {
    let style;

    if (animateOnHorizontalScroll) {
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

  _getCaptureButtonVerticalStyles(presets, windowDimensions, scrollY) {
    const { width, height } = windowDimensions;
    return {
      ...presets,
      top: scrollY.interpolate({
        inputRange: [0, height, 2*height],
        outputRange: [50, 0, 50],
      }),
      transform: [{
        scale: scrollY.interpolate({
          inputRange: [0, height, 2*height],
          outputRange: [0.6, 1, 0.6],
        }),
      }],
    };
  }

  render() {
    const windowDimensions = Dimensions.get('window');

    return (
      <View style={[styles.overlay, styles.bottomOverlay]}>
        <Animated.View style={{
          opacity: this.props.scrollAnimation.y.interpolate({
            inputRange: [0, windowDimensions.height, 2*windowDimensions.height],
            outputRange: [0, 1, 0],
          }),
        }}
        >
          <View style={{
            ...StyleSheet.flatten(styles.navigatorContainer),
            opacity: this.props.hideDashboardControls ? 0 : 1,
          }}
          >
            <TouchableWithoutFeedback onPress={() => this.props.onSideButtonPress(0)}>
              <Animated.View
                style={this._getSideButtonHorizontalStyles(
                  true,
                  StyleSheet.flatten(styles.dashboardButton),
                  this.props.animateOnHorizontalScroll,
                  windowDimensions.width,
                  this.props.scrollAnimation.x
                )}
              >
                <Animated.View
                  style={this._getSideButtonVerticalStyles(
                    true,
                    {},
                    windowDimensions,
                    this.props.scrollAnimation.y
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
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <Animated.View
                style={this._getMemoriesButtonHorizontalStyles(
                  StyleSheet.flatten(styles.dashboardButton),
                  windowDimensions.width,
                  this.props.animateOnHorizontalScroll,
                  this.props.scrollAnimation.x
                )}
              >
                <Animated.View
                  style={this._getMemoriesButtonVerticalStyles(
                    {},
                    windowDimensions,
                    this.props.scrollAnimation.y
                  )}
                >
                  <View style={styles.memoriesButton} />
                </Animated.View>
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.props.onSideButtonPress(2)}>
              <Animated.View
                style={this._getSideButtonHorizontalStyles(
                  false,
                  StyleSheet.flatten(styles.dashboardButton),
                  this.props.animateOnHorizontalScroll,
                  windowDimensions.width,
                  this.props.scrollAnimation.x
                )}
              >
                <Animated.View
                  style={this._getSideButtonVerticalStyles(
                    false,
                    StyleSheet.flatten(styles.dashboardButton),
                    windowDimensions,
                    this.props.scrollAnimation.y
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
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>

        <View style={styles.captureButtonContainer}>
          <Animated.View
            style={this._getCaptureButtonHorizontalStyles(
              {},
              windowDimensions.width,
              this.props.animateOnHorizontalScroll,
              this.props.scrollAnimation.x
            )}
          >
            <Animated.View
              style={this._getCaptureButtonVerticalStyles(
                {},
                windowDimensions,
                this.props.scrollAnimation.y
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
  dashboardButton: {
    width: 25,
    height: 25,
  },
  memoriesButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'white',
  },
});
