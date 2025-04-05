import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
  Mic,
  Play,
  StepBack,
  StepForward,
  X,
  StopCircle,
  ArrowLeft,
} from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";
import CountrySelect from "../src/components/common/CountrySelect";

interface RecordVoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (recordingData: any) => void;
  recordingType?: "post" | "comment" | "reply" | "chat";
  defaultCountry?: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const RecordVoiceModal: React.FC<RecordVoiceModalProps> = ({
  visible,
  onClose,
  onSave,
  recordingType = "post", // Default to post type (1 minute limit)
  defaultCountry = "United States",
}) => {
  const { theme, colors } = useTheme();
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);

  // Voice adjustment states
  const [pitch, setPitch] = useState(50);
  const [tempo, setTempo] = useState(50);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedMood, setSelectedMood] = useState("Happy");

  // Animation for waveform
  const waveformValues = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.5),
    new Animated.Value(0.7),
    new Animated.Value(0.4),
    new Animated.Value(0.8),
    new Animated.Value(0.6),
    new Animated.Value(0.3),
    new Animated.Value(0.5),
    new Animated.Value(0.7),
    new Animated.Value(0.4),
  ]).current;

  // Timer ref for recording
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animate waveform when recording
  useEffect(() => {
    if (isRecording) {
      const animations = waveformValues.map((value) => {
        return Animated.sequence([
          Animated.timing(value, {
            toValue: Math.random() * 0.8 + 0.2, // Random height between 0.2 and 1
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(value, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]);
      });

      const loopAnimation = Animated.loop(Animated.parallel(animations));

      loopAnimation.start();

      return () => {
        loopAnimation.stop();
      };
    }
  }, [isRecording, waveformValues]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          // Max recording time based on recordingType
          const maxTime = recordingType === "post" ? 60 : 30; // 1 min for posts, 30 sec for comments/replies/chat
          if (prev >= maxTime) {
            stopRecording();
            return maxTime;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, recordingType]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get remaining time for countdown display
  const getFormattedRemainingTime = () => {
    const maxTime = getMaxRecordingTime();
    const remaining = maxTime - recordingTime;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setRecordingComplete(false);
    // Here you would typically start actual recording using Expo Audio Recording API
    // For example:
    // async function startRecordingAudio() {
    //   try {
    //     await Audio.requestPermissionsAsync();
    //     await Audio.setAudioModeAsync({
    //       allowsRecordingIOS: true,
    //       playsInSilentModeIOS: true,
    //     });
    //     const { recording } = await Audio.Recording.createAsync(
    //       Audio.RecordingOptionsPresets.HIGH_QUALITY
    //     );
    //     setRecording(recording);
    //   } catch (err) {
    //     console.error('Failed to start recording', err);
    //   }
    // }
    // startRecordingAudio();
  };

  // Stop recording
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setRecordingComplete(true);
    // Here you would typically stop actual recording using Expo Audio Recording API
    // For example:
    // async function stopRecordingAudio() {
    //   try {
    //     if (!recording) return;
    //     await recording.stopAndUnloadAsync();
    //     const uri = recording.getURI();
    //     setRecordingUri(uri);
    //     setRecording(null);
    //   } catch (err) {
    //     console.error('Failed to stop recording', err);
    //   }
    // }
    // stopRecordingAudio();
  };

  // Toggle playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Here you would typically start/stop playback using Expo Audio API
  };

  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  // Handle save/post
  const handleSave = () => {
    // Create recording data object
    const recordingData = {
      duration: recordingTime,
      pitch,
      tempo,
      language: selectedLanguage,
      country: selectedCountry,
      mood: selectedMood,
      // In a real app, you would include the actual audio file reference here
    };

    onSave(recordingData);
    resetModal();
  };

  // Reset modal state
  const resetModal = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setRecordingComplete(false);
    setIsPlaying(false);
    setCurrentPlayTime(0);
    setPitch(50);
    setTempo(50);
    setSelectedLanguage("English");
    setSelectedCountry(defaultCountry);
    setSelectedMood("Happy");
    onClose();
  };

  // Get max recording time based on type
  const getMaxRecordingTime = () => (recordingType === "post" ? 60 : 30);

  // Get remaining time
  const getRemainingTime = () => getMaxRecordingTime() - recordingTime;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: theme === "dark" ? "#111112" : "#f9fafb" },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#9ca3af" />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitle,
                { color: theme === "dark" ? "white" : "#111827" },
              ]}
            >
              Record Voice{" "}
              {recordingType === "post"
                ? "Message (1 min max)"
                : "Comment (30 sec max)"}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Recording Section */}
          <View style={styles.recordingSection}>
            {/* Waveform Visualization */}
            <View
              style={[
                styles.waveformContainer,
                { backgroundColor: theme === "dark" ? "#202024" : "#f3f4f6" },
              ]}
            >
              <View style={styles.waveformContent}>
                {waveformValues.map((value, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.waveformBar,
                      {
                        height: value.interpolate
                          ? value.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["10%", "100%"],
                            })
                          : "50%",
                        backgroundColor: "#8b5cf6",
                      },
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Recording Controls */}
            {/* Countdown Timer Display */}
            {isRecording && (
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownText}>
                  Recording... {getFormattedRemainingTime()} remaining
                </Text>
                <View style={styles.timerProgressBar}>
                  <View
                    style={[
                      styles.timerProgress,
                      {
                        width: `${(recordingTime / getMaxRecordingTime()) * 100}%`,
                        backgroundColor:
                          recordingTime > getMaxRecordingTime() * 0.75
                            ? "#ef4444"
                            : "#8b5cf6",
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            <View style={styles.recordingControls}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: theme === "dark" ? "#202024" : "#e5e7eb" },
                ]}
                onPress={resetModal}
                activeOpacity={0.7}
              >
                <X size={24} color={theme === "dark" ? "#9ca3af" : "#4b5563"} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.recordButton,
                  isRecording && { backgroundColor: "#ef4444" },
                ]}
                onPress={isRecording ? stopRecording : startRecording}
                activeOpacity={0.7}
              >
                {isRecording ? (
                  <StopCircle size={32} color="#ffffff" />
                ) : (
                  <Mic size={32} color="#ffffff" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stopButton,
                  { backgroundColor: theme === "dark" ? "#202024" : "#e5e7eb" },
                  !isRecording && styles.disabledButton,
                ]}
                onPress={stopRecording}
                activeOpacity={0.7}
                disabled={!isRecording}
              >
                <StopCircle
                  size={24}
                  color={isRecording ? "#ffffff" : "#9ca3af"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {recordingComplete && (
            <View style={styles.recordingCompleteContainer}>
              {/* Playback Controls */}
              <View
                style={[
                  styles.playbackControlsContainer,
                  { backgroundColor: theme === "dark" ? "#202024" : "#f3f4f6" },
                ]}
              >
                <View style={styles.playbackControlsHeader}>
                  <View style={styles.playbackButtons}>
                    <TouchableOpacity
                      style={styles.playbackControlButton}
                      activeOpacity={0.7}
                    >
                      <StepBack size={24} color="#9ca3af" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={togglePlayback}
                      activeOpacity={0.7}
                    >
                      <Play size={20} color="#ffffff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.playbackControlButton}
                      activeOpacity={0.7}
                    >
                      <StepForward size={24} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.timeText,
                      { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
                    ]}
                  >
                    {formatTime(currentPlayTime)}
                  </Text>
                </View>

                {/* Voice Adjustments */}
                <View style={styles.voiceAdjustments}>
                  <View style={styles.sliderContainer}>
                    <Text
                      style={[
                        styles.sliderLabel,
                        { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
                      ]}
                    >
                      Pitch
                    </Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      value={pitch}
                      onValueChange={setPitch}
                      minimumTrackTintColor="#8b5cf6"
                      maximumTrackTintColor={
                        theme === "dark" ? "#2a2a2e" : "#e5e7eb"
                      }
                      thumbTintColor="#8b5cf6"
                    />
                  </View>

                  <View style={styles.sliderContainer}>
                    <Text
                      style={[
                        styles.sliderLabel,
                        { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
                      ]}
                    >
                      Tempo
                    </Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={100}
                      value={tempo}
                      onValueChange={setTempo}
                      minimumTrackTintColor="#8b5cf6"
                      maximumTrackTintColor={
                        theme === "dark" ? "#2a2a2e" : "#e5e7eb"
                      }
                      thumbTintColor="#8b5cf6"
                    />
                  </View>
                </View>
              </View>

              {/* Recording Details */}
              <View
                style={[
                  styles.recordingDetailsContainer,
                  { backgroundColor: theme === "dark" ? "#202024" : "#f3f4f6" },
                ]}
              >
                <View style={styles.languageContainer}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
                    ]}
                  >
                    Language
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor:
                          theme === "dark" ? "#2a2a2e" : "#e5e7eb",
                      },
                    ]}
                  >
                    <TextInput
                      value={selectedLanguage}
                      onChangeText={setSelectedLanguage}
                      placeholder="Enter language"
                      placeholderTextColor={
                        theme === "dark" ? "#6b7280" : "#9ca3af"
                      }
                      style={[
                        styles.textInput,
                        { color: theme === "dark" ? "white" : "#111827" },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.languageContainer}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
                    ]}
                  >
                    Country
                  </Text>
                  <CountrySelect
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                    placeholder="Select country"
                    label=""
                  />
                </View>

                <View style={styles.moodContainer}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
                    ]}
                  >
                    Mood
                  </Text>
                  <View style={styles.moodButtonsContainer}>
                    {[
                      "All",
                      "Happy",
                      "Sad",
                      "Anxious",
                      "Excited",
                      "Confused",
                      "Stressed",
                      "Calm",
                    ].map((mood) => (
                      <TouchableOpacity
                        key={mood}
                        style={[
                          styles.moodButton,
                          {
                            backgroundColor:
                              theme === "dark" ? "#2a2a2e" : "#e5e7eb",
                          },
                          selectedMood === mood
                            ? styles.selectedMoodButton
                            : null,
                        ]}
                        onPress={() => handleMoodSelect(mood)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.moodButtonText,
                            { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
                            selectedMood === mood
                              ? styles.selectedMoodButtonText
                              : null,
                          ]}
                        >
                          {mood}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.cancelActionButton,
                    {
                      backgroundColor: theme === "dark" ? "#202024" : "#e5e7eb",
                    },
                  ]}
                  onPress={resetModal}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.cancelActionButtonText,
                      { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.postButton}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
  },
  countdownContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  countdownText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8b5cf6",
    marginBottom: 8,
  },
  timerProgressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  timerProgress: {
    height: "100%",
    backgroundColor: "#8b5cf6",
  },
  header: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  recordingSection: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
  waveformContainer: {
    width: "100%",
    height: 96,
    marginBottom: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  waveformContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 80,
    paddingHorizontal: 8,
  },
  waveformBar: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  recordingControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  cancelButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 24,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  stopButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  recordingCompleteContainer: {
    marginTop: 32,
  },
  playbackControlsContainer: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  playbackControlsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  playbackButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  playbackControlButton: {
    padding: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  timeText: {
    color: "#9ca3af",
  },
  voiceAdjustments: {
    marginTop: 8,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  recordingDetailsContainer: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  languageContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    color: "white",
  },
  moodContainer: {},
  moodButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedMoodButton: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  moodButtonText: {
    color: "#9ca3af",
  },
  selectedMoodButtonText: {
    color: "#8b5cf6",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
    alignItems: "center",
    marginRight: 8,
  },
  cancelActionButtonText: {
    color: "#9ca3af",
  },
  postButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    marginLeft: 8,
  },
  postButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default RecordVoiceModal;
