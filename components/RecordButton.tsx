import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Mic } from "lucide-react-native";
import RecordVoiceModal from "./RecordVoiceModal";

interface RecordButtonProps {
  onPress?: () => void;
  size?: number;
  color?: string;
  onSaveRecording?: (recordingData: any) => void;
  recordingType?: "post" | "comment" | "reply" | "chat";
}

/**
 * Floating action button for recording new voice messages
 */
const RecordButton = ({
  onPress,
  size = 60,
  color = "#8b5cf6", // purple-500
  onSaveRecording = (data) => console.log("Recording saved:", data),
  recordingType = "post",
}: RecordButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSaveRecording = (recordingData: any) => {
    onSaveRecording(recordingData);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            { width: size, height: size, backgroundColor: color },
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Mic color="white" size={size * 0.4} />
        </TouchableOpacity>
      </View>

      <RecordVoiceModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveRecording}
        recordingType={recordingType}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    bottom: 90, // Positioned above the navigation bar
    backgroundColor: "transparent", // Ensure container is transparent
    // Remove shadow properties that might be causing the white square
    elevation: 0,
  },
  button: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default RecordButton;
