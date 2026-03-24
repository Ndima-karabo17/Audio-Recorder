import { RecordingOptions } from "expo-av/build/Audio";

/**
 * Cross-platform high-quality recording preset.
 * Uses M4A/AAC for iOS & Android; WebM for web.
 */
export const RECORDING_OPTIONS: RecordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: 2,   // MediaRecorder.OutputFormat.MPEG_4
    audioEncoder: 3,   // MediaRecorder.AudioEncoder.AAC
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".m4a",
    audioQuality: 127, // AVAudioQuality.high
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
};