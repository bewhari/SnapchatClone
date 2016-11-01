import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import Swiper from 'react-native-swiper';
import CameraView from './components/CameraView';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      horizontalIndex: 1,
      verticalIndex: 1,
      horizontalScrollEnabled: true,
    };

    this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
  }

  _onMomentumScrollEnd(e, verticalState, verticalContext) {
    this.setState({ horizontalScrollEnabled: verticalState.index == 1 });
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

            <CameraView ref="camera" />

            <View style={styles.container}>
              <Text>Bottom</Text>
            </View>
          </Swiper>

          <View style={styles.container}>
            <Text>Right</Text>
          </View>
        </Swiper>

        <View style={[styles.overlay, styles.bottomOverlay]}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => {this.refs.camera.takePicture()}}
          >
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
