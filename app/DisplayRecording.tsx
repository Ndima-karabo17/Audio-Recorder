import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';


export interface Recording {
  id: string;
  uri: string;
  timestamp: string;
  date: string;
}


interface DisplayRecordingProps {
  recordings: Recording[];
  onDelete?: (id: string) => void;
}

export default function DisplayRecording({ recordings, onDelete }: DisplayRecordingProps) {
  const player = useAudioPlayer();

  const handlePlay = (uri: string) => {
    player.replace(uri);
    player.play();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.timeText}>{item.timestamp}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={() => handlePlay(item.uri)}
            >
              <Ionicons name="play" size={30} color="black" />
            </TouchableOpacity>

            
            {onDelete && (
              <TouchableOpacity 
                style={styles.stopButton} 
                onPress={() => onDelete(item.id)} 
              >
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   marginBottom: 50
  },
  listContent: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#2a2829',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    elevation: 2,
    
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ece1e1ff',
  },
  timeText: {
    fontSize: 13,
    color: '#fcf6f6ff',
    marginTop: 2,
  },
  playButton: {
    backgroundColor: '#FF8C00', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  stopButton:{
backgroundColor: 'red',
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  playText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#f3eaeaff',
    marginTop: 10,
    fontSize: 16,
  },
});
