import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

class CameraSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back
      }
    };
  }

  componentDidMount() {
    this.func();
  }

  func = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    let camera = { ...this.state.camera };
    camera.hasCameraPermission = status === "granted";
    this.setState({ camera });
  };

  takePhoto = async () => {
    let photo = await this.camera.takePictureAsync();
    console.log(photo.uri);
    this.props.navigation.navigate("Home", {
      photo
    });
  };

  render() {
    if (this.state.camera.hasCameraPermission === null) {
      return <View />;
    } else if (this.state.camera.hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.camera.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  //   flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
                onPress={() => this.takePhoto()}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: "white",
                    width: 200,
                    margin: 40
                  }}
                >
                  TakePhoto
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
export default CameraSection;
