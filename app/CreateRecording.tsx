import { View, StyleSheet, TouchableOpacity} from "react-native";
import {  RecordingPresets, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons'; 
import { Recording } from "./DisplayRecording";

interface Props {
  onSave: (recording: Recording) => void;
}

export default function CreateRecording({ onSave }: Props) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    const uri = audioRecorder.uri;

    if (uri) {
      const now = new Date();
      const newEntry: Recording = {
        id: now.getTime().toString(),
        uri: uri,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
      };

      onSave(newEntry);
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={[styles.button, recorderState.isRecording && styles.buttonRecording]} 
        onPress={recorderState.isRecording ? stopRecording : record}
      >
        <Ionicons name={recorderState.isRecording ? "save-outline" : "mic"} size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'flex-end', 
      
           
  },
  button: {
    backgroundColor: '#FF8C00', 
    width: 64,                  
    height: 64,                 
    borderRadius: 32,           
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  buttonRecording: {
    backgroundColor: '#FF8C00', 
  }
});
