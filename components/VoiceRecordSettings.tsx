import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  X,
  Mic,
  Stop,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useTheme } from "../src/contexts/ThemeContext";

interface VoiceRecordSettingsProps {
  onClose?: () => void;
  onSave?: (recording: any, settings: RecordingSettings) => void;
}

interface RecordingSettings {
  pitch: number;
  tempo: number;
  mood: string;
  language: string;
}

const VoiceRecordSettings = ({ onClose, onSave }: VoiceRecordSettingsProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [pitch, setPitch] = useState(75);
  const [tempo, setTempo] = useState(60);
  const [selectedMood, setSelectedMood] = useState("Happy");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const moods = ["Happy", "Sad", "Anxious", "Excited", "Calm", "Reflective"];
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
  ];

  useEffect(() => {
    // Set up audio mode
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        });
        console.log("Audio mode set successfully");
      } catch (error) {
        console.error("Error setting audio mode:", error);
      }
    };

    setupAudio();

    // Cleanup function
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    if (!recordingUri) {
      Alert.alert("Error", "Please record a voice message first");
      return;
    }

    if (onSave && recordingUri) {
      onSave(
        {
          uri: recordingUri,
          duration: recordingDuration,
        },
        {
          pitch,
          tempo,
          mood: selectedMood,
          language: selectedLanguage,
        },
      );
    } else {
      // Save to local storage or database
      Alert.alert("Success", "Voice message saved successfully");
      router.back();
    }
  };

  const startRecording = async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant microphone permissions to record audio",
        );
        return;
      }

      // Unload any existing recording
      if (recording) {
        await recording.stopAndUnloadAsync();
      }
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      // Reset state
      setRecordingUri(null);
      setDuration(0);
      setPosition(0);
      setRecordingDuration(0);
      setIsPlaying(false);

      // Create new recording
      console.log("Starting new recording...");
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      setRecording(newRecording);
      setIsRecording(true);

      // Start timer for recording duration
      let seconds = 0;
      recordingTimerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingDuration(seconds);
      }, 1000);

      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording", error);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log("Stopping recording...");
      setIsRecording(false);

      // Stop the timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      // Stop recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);

      if (uri) {
        setRecordingUri(uri);
        setDuration(recordingDuration);

        // Load the recorded sound for playback
        loadSound(uri);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Error", "Failed to save recording. Please try again.");
    }
  };

  const loadSound = async (uri: string) => {
    try {
      console.log("Loading sound from URI:", uri);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
      );

      setSound(newSound);

      // Get sound status to update duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(
          status.durationMillis
            ? Math.floor(status.durationMillis / 1000)
            : recordingDuration,
        );
      }

      console.log("Sound loaded successfully");
    } catch (error) {
      console.error("Error loading sound:", error);
      Alert.alert("Error", "Failed to load recording for playback.");
    }
  };

  const togglePlayback = async () => {
    if (!sound || !recordingUri) {
      Alert.alert("Error", "No recording available to play");
      return;
    }

    try {
      if (isPlaying) {
        console.log("Pausing playback");
        await sound.pauseAsync();
        setIsPlaying(false);

        if (playbackTimerRef.current) {
          clearInterval(playbackTimerRef.current);
          playbackTimerRef.current = null;
        }
      } else {
        console.log("Starting playback");
        await sound.playAsync();
        setIsPlaying(true);

        // Update position during playback
        playbackTimerRef.current = setInterval(async () => {
          if (sound) {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
              setPosition(
                status.positionMillis
                  ? Math.floor(status.positionMillis / 1000)
                  : 0,
              );

              // Stop timer when playback ends
              if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
                await sound.setPositionAsync(0);
                if (playbackTimerRef.current) {
                  clearInterval(playbackTimerRef.current);
                  playbackTimerRef.current = null;
                }
              }
            }
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error during playback:", error);
      Alert.alert("Error", "Failed to play recording. Please try again.");
    }
  };

  const seekBackward = async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(0, status.positionMillis - 5000);
        await sound.setPositionAsync(newPosition);
        setPosition(Math.floor(newPosition / 1000));
      }
    } catch (error) {
      console.error("Error seeking backward:", error);
    }
  };

  const seekForward = async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        const newPosition = Math.min(
          status.durationMillis,
          status.positionMillis + 5000,
        );
        await sound.setPositionAsync(newPosition);
        setPosition(Math.floor(newPosition / 1000));
      }
    } catch (error) {
      console.error("Error seeking forward:", error);
    }
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-white"}`}
    >
      {/* Header */}
      <View
        className={`px-4 py-3 ${theme === "dark" ? "bg-[#111112]/80 border-gray-800" : "bg-white/80 border-gray-200"} border-b`}
      >
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={handleClose}
            className={`w-10 h-10 rounded-full ${theme === "dark" ? "bg-[#202024]/50" : "bg-gray-100"} items-center justify-center`}
          >
            <ArrowLeft
              size={20}
              color={theme === "dark" ? "#d1d5db" : "#374151"}
            />
          </TouchableOpacity>
          <Text
            className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Record Voice Message
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-5 pt-5 pb-24">
        {/* Recording Section */}
        <View className="items-center justify-center h-[320px] mb-6">
          {/* Waveform Visualization */}
          <View
            className={`w-full h-32 mb-10 ${theme === "dark" ? "bg-[#202024]/50" : "bg-gray-100"} rounded-2xl items-center justify-center overflow-hidden ${theme === "dark" ? "border border-white/5" : "border border-gray-200"}`}
          >
            <View className="flex-row items-center gap-[3px]">
              {Array.from({ length: 30 }).map((_, index) => {
                // Create a dynamic height based on index for a wave-like effect
                const baseHeight = 10;
                const variation =
                  Math.sin(index * 0.5) * 10 + Math.random() * 5;
                const height =
                  baseHeight + variation * (isRecording || isPlaying ? 1 : 0.5);

                return (
                  <View
                    key={index}
                    style={{
                      width: 3,
                      height,
                      backgroundColor: isRecording
                        ? "#ec4899"
                        : isPlaying
                          ? "#8b5cf6"
                          : theme === "dark"
                            ? "#4b5563"
                            : "#d1d5db",
                      borderRadius: 9999,
                    }}
                    className={`${isRecording || isPlaying ? "animate-pulse" : ""}`}
                  />
                );
              })}
            </View>
          </View>

          {/* Recording Controls */}
          <View className="flex-row items-center gap-8">
            <TouchableOpacity
              className={`w-14 h-14 rounded-full ${theme === "dark" ? "bg-[#202024]/50 border border-white/5" : "bg-gray-100 border border-gray-200"} items-center justify-center`}
              onPress={handleClose}
            >
              <X size={20} color={theme === "dark" ? "#d1d5db" : "#374151"} />
            </TouchableOpacity>

            {isRecording ? (
              <TouchableOpacity
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 items-center justify-center shadow-lg"
                onPress={stopRecording}
              >
                <Stop size={28} color="#ffffff" />
              </TouchableOpacity>
            ) : recordingUri ? (
              <TouchableOpacity
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 items-center justify-center shadow-lg"
                onPress={togglePlayback}
              >
                {isPlaying ? (
                  <Pause size={28} color="#ffffff" />
                ) : (
                  <Play size={28} color="#ffffff" style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 items-center justify-center shadow-lg"
                onPress={startRecording}
              >
                <Mic size={28} color="#ffffff" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className={`w-14 h-14 rounded-full ${theme === "dark" ? "bg-[#202024]/50 border border-white/5" : "bg-gray-100 border border-gray-200"} items-center justify-center`}
              onPress={() => {
                if (recording) {
                  stopRecording();
                } else if (recordingUri) {
                  // Reset recording
                  setRecordingUri(null);
                  setDuration(0);
                  setPosition(0);
                  setRecordingDuration(0);
                  if (sound) {
                    sound.unloadAsync();
                    setSound(null);
                  }
                  setIsPlaying(false);
                }
              }}
            >
              <Stop
                size={20}
                color={theme === "dark" ? "#d1d5db" : "#374151"}
              />
            </TouchableOpacity>
          </View>

          {/* Recording Status */}
          <Text
            className={`mt-4 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            {isRecording
              ? `Recording: ${formatTime(recordingDuration)}`
              : recordingUri
                ? `Recording: ${formatTime(duration)}`
                : "Ready to record"}
          </Text>
        </View>

        {/* Voice Edit Section */}
        <View className="space-y-4">
          {/* Playback Controls - Only show when recording exists */}
          {recordingUri && (
            <View
              className={`${theme === "dark" ? "bg-[#202024]/50 border border-white/5" : "bg-gray-50 border border-gray-200"} rounded-2xl p-5`}
            >
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-5">
                  <TouchableOpacity
                    className={`w-12 h-12 rounded-full ${theme === "dark" ? "bg-[#2a2a2e]/50" : "bg-gray-200"} items-center justify-center`}
                    onPress={seekBackward}
                  >
                    <SkipBack
                      size={20}
                      color={theme === "dark" ? "#d1d5db" : "#374151"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 items-center justify-center shadow-md"
                    onPress={togglePlayback}
                  >
                    {isPlaying ? (
                      <Pause size={20} color="#ffffff" />
                    ) : (
                      <Play
                        size={20}
                        color="#ffffff"
                        style={{ marginLeft: 2 }}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`w-12 h-12 rounded-full ${theme === "dark" ? "bg-[#2a2a2e]/50" : "bg-gray-200"} items-center justify-center`}
                    onPress={seekForward}
                  >
                    <SkipForward
                      size={20}
                      color={theme === "dark" ? "#d1d5db" : "#374151"}
                    />
                  </TouchableOpacity>
                </View>
                <Text
                  className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-medium`}
                >
                  {formatTime(position)} / {formatTime(duration)}
                </Text>
              </View>

              {/* Progress bar */}
              <View className="mb-4">
                <Slider
                  minimumValue={0}
                  maximumValue={duration > 0 ? duration : 1}
                  value={position}
                  onValueChange={(value) => {
                    if (sound) {
                      sound.setPositionAsync(value * 1000);
                      setPosition(value);
                    }
                  }}
                  minimumTrackTintColor="#8b5cf6"
                  maximumTrackTintColor={
                    theme === "dark" ? "#2a2a2e" : "#e5e7eb"
                  }
                  thumbTintColor="#ec4899"
                  style={{ width: "100%", height: 40 }}
                />
              </View>

              {/* Voice Adjustments */}
              <View className="space-y-5">
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text
                      className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Pitch
                    </Text>
                    <Text className="text-sm text-purple-500">{pitch}%</Text>
                  </View>
                  <Slider
                    minimumValue={0}
                    maximumValue={100}
                    value={pitch}
                    onValueChange={(value) => setPitch(Math.round(value))}
                    minimumTrackTintColor="#8b5cf6"
                    maximumTrackTintColor={
                      theme === "dark" ? "#2a2a2e" : "#e5e7eb"
                    }
                    thumbTintColor="#ec4899"
                    style={{ width: "100%", height: 40 }}
                  />
                </View>
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text
                      className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Tempo
                    </Text>
                    <Text className="text-sm text-purple-500">{tempo}%</Text>
                  </View>
                  <Slider
                    minimumValue={0}
                    maximumValue={100}
                    value={tempo}
                    onValueChange={(value) => setTempo(Math.round(value))}
                    minimumTrackTintColor="#8b5cf6"
                    maximumTrackTintColor={
                      theme === "dark" ? "#2a2a2e" : "#e5e7eb"
                    }
                    thumbTintColor="#ec4899"
                    style={{ width: "100%", height: 40 }}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Recording Details */}
          <View
            className={`${theme === "dark" ? "bg-[#202024]/50 border border-white/5" : "bg-gray-50 border border-gray-200"} rounded-2xl p-5`}
          >
            {/* Language Selection */}
            <View className="mb-5">
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                Language
              </Text>
              <View
                className={`w-full ${theme === "dark" ? "bg-[#2a2a2e]/70" : "bg-white"} rounded-xl px-4 py-3`}
              >
                <Text
                  className={
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }
                >
                  {selectedLanguage}
                </Text>
              </View>
            </View>

            {/* Mood Selection */}
            <View>
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-3`}
              >
                Mood
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {moods.map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    className={`px-5 py-2.5 rounded-full ${selectedMood === mood ? "bg-gradient-to-r from-purple-600 to-pink-500" : theme === "dark" ? "bg-[#2a2a2e]/70" : "bg-white border border-gray-200"}`}
                    onPress={() => setSelectedMood(mood)}
                  >
                    <Text
                      className={`text-sm font-medium ${selectedMood === mood ? "text-white" : theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {mood}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 pt-2">
            <TouchableOpacity
              className={`flex-1 py-3.5 rounded-xl ${theme === "dark" ? "bg-[#202024]/50 border border-white/5" : "bg-gray-100 border border-gray-200"}`}
              onPress={handleClose}
            >
              <Text
                className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-medium text-center`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg ${!recordingUri ? "opacity-50" : ""}`}
              onPress={handleSave}
              disabled={!recordingUri}
            >
              <Text className="text-white font-medium text-center">Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VoiceRecordSettings;
