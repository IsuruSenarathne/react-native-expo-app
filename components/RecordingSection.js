import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";

const soundObject = new Audio.Sound();

export default function RecordingSection({ setRecording }) {
  let [recording, setNewRecording] = React.useState(new Audio.Recording());
  let [isRec, setIsRec] = React.useState(false);
  let [recStatus, setRecStatus] = React.useState({});
  let [soundObj, setSoundObj] = React.useState(null);
  let [recUri, setRecUri] = React.useState("./assets/sounds/hello.mp3");

  const handleStartRecord = async () => {
    const recording = new Audio.Recording();
    setNewRecording(recording);
    Audio.requestPermissionsAsync();
    try {
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setIsRec(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopRecord = async () => {
    try {
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      const soundObj = await recording.createNewLoadedSoundAsync();
      setRecording(uri);
      setRecUri(uri);
      setIsRec(false);
      setRecStatus(await recording.getStatusAsync());
      setSoundObj(soundObj);
    } catch (error) {
      console.log(error);
      // An error occurred!
    }
  };

  const handlePlayRecord = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: recUri });
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  };

  function Separator() {
    return <View style={styles.separator} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        {!isRec ? (
          <Text>Press Start to record audio</Text>
        ) : (
          <Text>Recording started...</Text>
        )}
      </View>

      {!isRec && (
        <Button title="Start Recording" onPress={() => handleStartRecord()} />
      )}
      {isRec && (
        <Button title="Stop Recording" onPress={() => handleStopRecord()} />
      )}
      <Separator />
      {soundObj && (
        <Button title="Play recording" onPress={() => handlePlayRecord()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center"
  },
  separator: {
    marginVertical: 8
  }
});
