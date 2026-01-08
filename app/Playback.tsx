import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { Ionicons } from '@expo/vector-icons';

interface PlaybackProps {
  uri: string | null;
}

export default function Playback({ uri }: PlaybackProps) {
  const player = useAudioPlayer(uri);

  if (!uri) return null; 

  const handleTogglePlay = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Last Recording</Text>
      
      <View style={styles.controls}>
       
        <TouchableOpacity style={styles.iconButton} onPress={handleTogglePlay}>
          <Ionicons 
            name={player.playing ? "pause" : "play"} 
            size={36} 
            color="black" 
          />
        </TouchableOpacity>

    
        <TouchableOpacity 
          style={[styles.iconButton, styles.secondaryButton]} 
          onPress={() => { player.seekTo(0); player.play(); }}
        >
          <Ionicons name="trash" size={24} color="#e98e20ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#2a2829',
    borderRadius: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3d3b3c',
  },
  label: {
    color: '#bbb',
    fontSize: 14,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#FF8C00',
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF8C00',
    width: 45,
    height: 45,
  }
});