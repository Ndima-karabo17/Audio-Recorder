import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRecorder } from "../hooks/useRecorder";
import { useAuth } from "../context/AuthContext";
import { Recording } from "../types/recording";
import { formatDuration } from "../utils/format";
import AuthModal from "./AuthModal";

interface Props {
  onSave: (recording: Recording) => void;
}

export default function CreateRecording({ onSave }: Props) {
  const { user } = useAuth();
  const { isRecording, elapsedMs, startRecording, stopRecording } = useRecorder();
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const handlePress = async () => {
    // Guard: require sign-in before recording
    if (!user) {
      setAuthModalVisible(true);
      return;
    }

    if (isRecording) {
      const saved = await stopRecording();
      if (saved) onSave(saved);
    } else {
      await startRecording();
    }
  };

  return (
    <>
      <View style={styles.footer}>
        {isRecording && (
          <View style={styles.timerBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.timerText}>{formatDuration(elapsedMs)}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.button, isRecording && styles.buttonRecording]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Ionicons name={isRecording ? "stop" : "mic"} size={30} color="white" />
        </TouchableOpacity>
      </View>

      <AuthModal
        visible={authModalVisible}
        onDismiss={() => setAuthModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 30,
    right: 24,
    alignItems: "center",
    gap: 10,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1819",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ff4444",
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
  },
  timerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  button: {
    backgroundColor: "#FF8C00",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonRecording: {
    backgroundColor: "#ff4444",
    shadowColor: "#ff4444",
  },
});