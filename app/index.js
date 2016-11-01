import React, { Component } from 'react';
import {
  //Animated,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import Swiper from 'react-native-swiper';
import CameraView from './components/CameraView';
import CaptureView from './components/CaptureView';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      horizontalIndex: 1,
      verticalIndex: 1,
      horizontalScrollEnabled: true,

      capturePreview: false,

      //cameraAnimation: new Animated.Value(1),
    };

    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    this._handleCapture = this._handleCapture.bind(this);
    this._cancelCapture = this._cancelCapture.bind(this);
  }

  _onMomentumScrollEnd(e, verticalState, verticalContext) {
    this.setState({ horizontalScrollEnabled: verticalState.index == 1 });
  }

  _handleCapture(data) {
    console.log(data);
    this._photoPath = data.path;
    this.setState({capturePreview: true});
  }

  _cancelCapture() {
    this.setState({capturePreview: false});
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
          this.state.capturePreview
          &&
          <CaptureView
            uri={this._photoPath}
            onCancel={this._cancelCapture}
          />
        }

        <View style={[styles.overlay, styles.bottomOverlay]}>
          <TouchableOpacity
            disabled={this.state.capturePreview}
            onPressOut={() => {
              if (this.refs.camera.state.isRecording) {
                this.refs.camera.stopRecording();
              } else {
                this.refs.camera.takePicture();
              }
              /* Animated.timing(
                this.state.cameraAnimation,
                {
                  toValue: 0.5,
                  friction: 1,
                }
              ).start(); */
            }}
            delayLongPress={300}
            onLongPress={() => {
              this.refs.camera.startRecording();
            }}
          >
            {/*
            <Animated.View style={{
              ...StyleSheet.flatten(styles.captureButton),
              transform: [{scale: this.state.cameraAnimation}],
            }}/>
            */}
            <View style={styles.captureButton} />
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
    borderWidth: 5,
    borderColor: 'white',
  },
});
