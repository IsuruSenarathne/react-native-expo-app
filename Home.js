import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  SafeAreaView
} from "react-native";
import RecordingSection from "./components/RecordingSection";
import CameraSection from "./components/CameraSection";
import * as MailComposer from "expo-mail-composer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import _ from "lodash";

export default class App extends React.Component {
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
        attachments: _.compact([photo, recording])
      };
      MailComposer.composeAsync(saveOptions);
    } catch (error) {
      console.error(error);
    }
  };

  Separator = () => {
    return <View style={styles.separator} />;
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

  componentDidUpdate(prevProps, prevState) {
    // console.log("this.props.route.params>>>>>>>>", this.props.route.params);
    if (!_.isEqual(prevProps.route.params, this.props.route.params)) {
      const photo = this.props.route.params
        ? this.props.route.params.photo
        : "";
      if (photo) {
        this.setState({ photo: this.props.route.params?.photo.uri });
      }
    }
  }

  componentDidMount() {
    this._getLocationAsync();
  }

  render() {
    // console.log('this.state--->>>>', this.state);
    return (
      <>
        {/* <SafeAreaView style={styles.container}> */}
        <RecordingSection setRecording={this.setRecording} />
        <View style={styles.container}>
          <Text>Take Photo</Text>
          <Button
            // style={styles.button}
            title="Go to Camera"
            onPress={() => this.props.navigation.navigate("Camera")}
          />
          {this.Separator()}
          <Button title="SEND EMAIL" onPress={() => this.handleEmail()} />
        </View>
        {/* </SafeAreaView> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 40
  },
  title: {
    textAlign: "center",
    marginVertical: 8
  },
  fixToText: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  separator: {
    marginVertical: 8
  }
});
