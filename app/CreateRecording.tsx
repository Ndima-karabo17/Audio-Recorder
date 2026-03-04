import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from '@expo/vector-icons';
import { Recording } from "./DisplayRecording";
import React, { useState } from "react";

interface Props {
  onSave: (recording: Recording) => void;
}

export default function CreateRecording({ onSave }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Expo 54 compatible recording options
  const recordingOptions = {
    android: {
      extension: '.m4a',
      outputFormat: 2, // MPEG_4
      audioEncoder: 3, // AAC
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      audioQuality: 127, // HIGH
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
     web: {
    mimeType: 'audio/webm', // required for web
    bitsPerSecond: 128000,
  },
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Microphone access is needed.');
        return;
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording.');
      console.log(err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        const now = new Date();
        const newEntry: Recording = {
          id: now.getTime().toString(),
          uri,
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        onSave(newEntry);
      }

      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to stop recording.');
      console.log(err);
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.buttonRecording]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Ionicons name={isRecording ? "stop" : "mic"} size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  button: {
    backgroundColor: '#FF8C00',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonRecording: {
    backgroundColor: '#ff4444',
  },
});