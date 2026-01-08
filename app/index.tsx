import { View, StyleSheet, Text} from "react-native";
import CreateRecording from "./CreateRecording";
import DisplayRecording, { Recording } from "./DisplayRecording";
import { useState } from "react";
import Playback from "./Playback";

export default function Index() {
const [savedRecordings, setSavedRecordings] = useState<Recording[]>([]);

  return (
    <View style={styles.container}>
      <Text>You voice note</Text>
      <DisplayRecording recordings={savedRecordings}/>
      <Playback uri={savedRecordings.length > 0 ? savedRecordings[0].uri : null}></Playback>
      <CreateRecording onSave={(newRec) => setSavedRecordings([newRec, ...savedRecordings])} />
    

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
    
    backgroundColor: '#1f1d1eff',
    padding: 1,
  },
});

