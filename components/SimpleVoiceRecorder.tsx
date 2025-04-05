import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Mic, StopCircle, X } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";

interface SimpleVoiceRecorderProps {
  visible: boolean;
  onClose: () => void;
  onSave: (recordingData: any) => void;
}

const SimpleVoiceRecorder: React.FC<SimpleVoiceRecorderProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);

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
          // Max recording time is 30 seconds
          const maxTime = 30;
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
  }, [isRecording]);

  // Get remaining time for countdown display
  const getFormattedRemainingTime = () => {
    const maxTime = 30; // 30 seconds max
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
  };

  // Save recording
  const handleSave = () => {
    if (recordingTime === 0) {
      // Don't save if no recording was made
      alert("Please record a voice message first");
      return;
    }

    // Create recording data object
    const recordingData = {
      duration: recordingTime,
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
    onClose();
  };

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
          {
            backgroundColor:
              theme === "dark"
                ? "rgba(17, 17, 18, 0.95)"
                : "rgba(249, 250, 251, 0.95)",
          },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme === "dark" ? "#202024" : "#ffffff" },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.headerTitle,
                { color: theme === "dark" ? "white" : "#111827" },
              ]}
            >
              Record Voice Message (30s max)
            </Text>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={styles.closeButton}
            >
              <X size={24} color={theme === "dark" ? "#9ca3af" : "#6b7280"} />
            </TouchableOpacity>
          </View>

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

            {/* Countdown Timer Display */}
            {isRecording && (
              <View style={styles.countdownContainer}>
                <Text style={[styles.countdownText, { color: "#8b5cf6" }]}>
                  {getFormattedRemainingTime()} remaining
                </Text>
                <View
                  style={[
                    styles.timerProgressBar,
                    {
                      backgroundColor: theme === "dark" ? "#3f3f46" : "#e5e7eb",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.timerProgress,
                      {
                        width: `${(recordingTime / 30) * 100}%`,
                        backgroundColor:
                          recordingTime > 22.5 ? "#ef4444" : "#8b5cf6",
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Recording Controls */}
            <View style={styles.recordingControls}>
              {!isRecording && recordingTime > 0 && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              )}

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

              {!isRecording && recordingTime > 0 && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={resetModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 350,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  recordingSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  waveformContainer: {
    width: "100%",
    height: 80,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  waveformContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 60,
    paddingHorizontal: 8,
  },
  waveformBar: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  countdownContainer: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  countdownText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  timerProgressBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  timerProgress: {
    height: "100%",
    backgroundColor: "#8b5cf6",
  },
  recordingControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#10b981",
    borderRadius: 20,
    marginRight: 16,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#6b7280",
    borderRadius: 20,
    marginLeft: 16,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default SimpleVoiceRecorder;
