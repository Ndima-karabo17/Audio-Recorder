import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Audio } from "expo-av";
import React, { useState } from "react";

export interface Recording {
  id: string;
  uri: string;
  timestamp: string;
  date: string;
}

interface Props {
  recordings: Recording[];
  onDelete?: (id: string) => void;
}

export default function DisplayRecording({ recordings, onDelete }: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleTogglePlay = async (item: Recording) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        if (playingId === item.id) {
          setPlayingId(null);
          return;
        }
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: item.uri });
      setSound(newSound);
      setPlayingId(item.id);
      await newSound.playAsync();

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
          newSound.unloadAsync();
        }
      });

    } catch (err) {
      console.log("Playback error", err);
    }
  };

  return (
    <FlatList
      data={recordings}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.textContainer}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.timeText}>{item.timestamp}</Text>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={() => handleTogglePlay(item)}>
            <Ionicons name={playingId === item.id ? "pause" : "play"} size={30} color="black" />
          </TouchableOpacity>

          {onDelete && (
            <TouchableOpacity style={styles.stopButton} onPress={() => onDelete(item.id)}>
              <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="musical-notes-outline" size={48} color="#f3e9e9ff" />
          <Text style={styles.emptyText}>Start voice notes</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2829',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: { flex: 1 },
  dateText: { color: '#ece1e1ff', fontSize: 16, fontWeight: '600' },
  timeText: { color: '#fcf6f6ff', fontSize: 13, marginTop: 2 },
  playButton: { backgroundColor: '#FF8C00', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  stopButton: { backgroundColor: 'red', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#f3eaeaff', marginTop: 10, fontSize: 16 },
});