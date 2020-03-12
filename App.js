import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import RecordingSection from "./components/RecordingSection";
import CameraSection from "./components/CameraSection";
import * as MailComposer from "expo-mail-composer";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: "",
      recording: "",
      location: ""
    };
  }

  setPhoto = photoUri => {
    this.setState({ photo: photoUri });
  };

  setRecording = recordingUri => {
    this.setState({ recording: recordingUri });
  };

  handleEmail = () => {
    const saveOptions = {
      recipients: ["abc@abc.com"],
      subject: "hello bella",
      attachments: [this.state.photo, this.state.recording]
    };
    MailComposer.composeAsync(saveOptions);
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <RecordingSection setRecording={this.setRecording} />
          <Button title="SEND EMAIL" onPress={() => this.handleEmail()} />
        </View>
        <CameraSection setPhoto={this.setPhoto} />
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
