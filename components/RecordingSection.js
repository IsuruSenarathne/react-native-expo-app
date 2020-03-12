import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";

const soundObject = new Audio.Sound();

export default function RecordingSection({ setRecording }) {
  const [sound, setSound] = React.useState("");
  const [recording, setNewRecording] = React.useState(new Audio.Recording());

  const handleStartRecord = async () => {
    const recording = new Audio.Recording();
    setNewRecording(recording);
    Audio.requestPermissionsAsync();
    Alert.alert("started...");
    console.log("no error");
    try {
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopRecord = async () => {
    try {
      MediaLibrary.requestPermissionsAsync();
      await recording.stopAndUnloadAsync();
      Alert.alert("stopped");
      console.log(await recording.getStatusAsync());

      const uri = recording.getURI();
      setSound(uri);
      console.log(recording.getURI());
      MediaLibrary.saveToLibraryAsync(recording.getURI());

      const soundObj = await recording.createNewLoadedSoundAsync();
      setRecording(uri);
      // FileSystem.downloadAsync(recording.getURI(), FileSystem.documentDirectory + 'lolfile.mp3')
      //   .then(({ uri }) => {
      //     console.log("finished downloading to", uri);
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   });
      // console.log({soundObj})
      // await soundObject.loadAsync(require('./assets/sounds/hello.mp3'));
      await soundObj.sound.playAsync();
      // You are now recording!
    } catch (error) {
      Alert.alert("stoppedeee");
      console.log(error);
      // An error occurred!
    }
  };

  return (
    <View style={styles.container}>
      <Text>Recording Section</Text>
      <Button title="Start" onPress={() => handleStartRecord()} />
      <Button title="Stop" onPress={() => handleStopRecord()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
