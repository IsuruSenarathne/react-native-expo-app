import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import RecordingSection from "./components/RecordingSection";
import CameraSection from "./components/CameraSection";
import * as MailComposer from "expo-mail-composer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: "",
      recording: "",
      location: {
        longitude: "",
        latitude: ""
      }
    };
  }

  setPhoto = photoUri => {
    this.setState({ photo: photoUri });
  };

  setRecording = recordingUri => {
    this.setState({ recording: recordingUri });
  };

  handleEmail = () => {
    const { photo, recording } = this.state;
    console.log(photo);
    console.log(recording);
    try {
      const saveOptions = {
        recipients: ["abc@abc.com"],
        subject: "hello bella",
        body:
          "Location\nLongtude:" +
          this.state.location.longitude +
          "\nLatitude: " +
          this.state.location.latitude,
        attachments: [photo, recording]
      };
      MailComposer.composeAsync(saveOptions);
    } catch (error) {
      console.error(error);
    }
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = {};
    let locationMap = await Location.getCurrentPositionAsync({});
    location.longitude = locationMap.coords.longitude;
    location.latitude = locationMap.coords.latitude;
    this.setState({ location });
  };

  componentDidMount() {
    console.log("sssss", this.props.route.params?.photo);
    this._getLocationAsync();
    if (this.props.route.params?.photo) {
      this.setState({ photo: this.props.route.params?.photo.uri });
    }
  }
  render() {
    console.log(this.state);
    return (
      <>
        <View style={styles.container}>
          <Text>Home Screen</Text>
          <Button
            title="Go to Camera"
            onPress={() => this.props.navigation.navigate("Camera")}
          />
          <RecordingSection setRecording={this.setRecording} />
          <Button title="SEND EMAIL" onPress={() => this.handleEmail()} />
        </View>
      </>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
