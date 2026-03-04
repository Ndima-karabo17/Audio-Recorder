import { View, StyleSheet, Text } from "react-native";
import CreateRecording from "./CreateRecording";
import DisplayRecording, { Recording } from "./DisplayRecording";
import React, { useState } from "react";

export default function Index() {
  const [savedRecordings, setSavedRecordings] = useState<Recording[]>([]);

  const handleDelete = (id: string) => {
    setSavedRecordings(prev => prev.filter(rec => rec.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Voice Notes</Text>

      <DisplayRecording
        recordings={savedRecordings}
        onDelete={handleDelete}
      />

      <CreateRecording
        onSave={(newRec) => setSavedRecordings(prev => [newRec, ...prev])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f1d1e', padding: 8 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 16, marginBottom: 8, marginLeft: 16 },
});