import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Video from 'react-native-video';
import {
  CAPTION_MIN_OFFSET_TOP,
  CAPTION_MIN_OFFSET_BOTTOM,
  CAPTION_HEIGHT,
  CAPTION_PADDING,
} from '../../constants';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class CaptureView extends Component {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    hideStatusBar: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isCaptioning: false,
      caption: '',
      drag: new Animated.ValueXY({x: 0, y: 0.65*WINDOW_HEIGHT}),

      captionAnimation: new Animated.Value(0),
    };

    this._handleOnMediaPress = this._handleOnMediaPress.bind(this);
    this._handleOnCaptionPress = this._handleOnCaptionPress.bind(this);
  }

  componentWillMount() {
    this._dragY = 0.65*WINDOW_HEIGHT;
    this.state.drag.y.addListener((value) => this._dragY = value.value);

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        this.state.drag.setOffset({x: 0, y: this._dragY});
        this.state.drag.setValue({x: 0, y: 0});
      },
      onPanResponderMove: Animated.event([null, {
        dx: this.state.drag.x,
        dy: this.state.drag.y,
      }]),
      onPanResponderRelease: (e, gesture) => {
        this.state.drag.flattenOffset();
      }
    });

    this._keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      Animated.spring(this.state.captionAnimation, {
        toValue: WINDOW_HEIGHT - (e.endCoordinates.height + CAPTION_HEIGHT + Math.min(Math.max(this._dragY, CAPTION_MIN_OFFSET_TOP), WINDOW_HEIGHT - CAPTION_MIN_OFFSET_BOTTOM)),
        friction: 10,
        duration: 100,
      }).start();
    });

    this._keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
      Animated.spring(this.state.captionAnimation, {
        toValue: 0,
        friction: 10,
        duration: 100,
      }).start();
    });
  }

  componentWillUnmount() {
    this.state.drag.y.removeAllListeners();
    this._keyboardWillShowListener.remove();
    this._keyboardWillHideListener.remove();
  }

  _handleOnMediaPress() {
    if (!this.state.isCaptioning && !this.state.caption) {
      this.setState({isCaptioning: true});
    } else if (this.state.isCaptioning) {
      this.setState({isCaptioning: false});
    }
  }

  _handleOnCaptionPress() {
    if (!this.state.isCaptioning) {
      this.setState({isCaptioning: true});
    }
  }

  render() {
    const { uri, type, onCancel } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar hidden={this.props.hideStatusBar} />

        <TouchableWithoutFeedback
          onPress={this._handleOnMediaPress}
        >
          {
            type == 0 &&
              <Image
                style={styles.preview}
                source={{uri}}
              />
            ||
            type == 1 &&
              <Video
                source={{uri}}
                rate={1}
                volume={1}
                repeat={true}
                style={styles.preview}
              />
            ||
            <View style={styles.preview}>
              <Text>Media not recognized</Text>
            </View>
          }
        </TouchableWithoutFeedback>

        { (this.state.isCaptioning || !!this.state.caption) &&
          <Animated.View
            {...this.panResponder.panHandlers}
            style={{
              top: Animated.diffClamp(
                this.state.drag.y,
                CAPTION_MIN_OFFSET_TOP,
                WINDOW_HEIGHT - CAPTION_MIN_OFFSET_BOTTOM
              ),
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}
          >
            <Animated.View
              style={{
                top: this.state.captionAnimation,
                left: 0,
                right: 0,
                height: CAPTION_HEIGHT,
                padding: CAPTION_PADDING,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            >
            <TouchableWithoutFeedback onPress={this._handleOnCaptionPress}>
              <View
                style={{
                  width: Dimensions.get('window').width,
                  height: CAPTION_HEIGHT - 2*CAPTION_PADDING,
                  alignItems: 'center',
                }}
              >
                { this.state.isCaptioning &&
                  <TextInput
                    style={{
                      height: CAPTION_HEIGHT - 2*CAPTION_PADDING,
                      color: 'white',
                      fontSize: 14,
                    }}
                    onChangeText={(caption) => this.setState({caption})}
                    value={this.state.caption}
                    autoFocus={true}
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  ||
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'white',
                    }}
                  >
                    {this.state.caption}
                  </Text>
                }
              </View>
            </TouchableWithoutFeedback>
            </Animated.View>
          </Animated.View>
        }

        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onCancel}
          >
            <Image
              style={styles.icon}
              source={require('../../assets/ic-cancel-preview.png')}
            />
          </TouchableOpacity>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupTopRight]}
                source={require('../../assets/ic-notepad.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupTopRight]}
                source={require('../../assets/ic-text-tool.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupTopRight]}
                source={require('../../assets/ic-pencil.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.overlay, styles.bottomOverlay]}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupBottomLeft]}
                source={require('../../assets/ic-clock.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupBottomLeft]}
                source={require('../../assets/ic-save.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={this.props.onCancel}
            >
              <Image
                style={[styles.icon, styles.iconGroupBottomLeft]}
                source={require('../../assets/ic-add-story.png')}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={this.props.onCancel}
          >
            <Image
              style={styles.sendIcon}
              source={require('../../assets/ic-send.png')}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
  },
  preview: {
    width: Dimensions.get('window').width,
    height: WINDOW_HEIGHT,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 5,
  },
  icon: {
    width: 25,
    height: 25,
  },
  sendIcon: {
    width: 40,
    height: 40,
  },
  iconGroupTopRight: {
    marginLeft: 10,
  },
  iconGroupBottomLeft: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
