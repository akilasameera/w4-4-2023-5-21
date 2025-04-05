import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../src/contexts/ThemeContext";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Keyboard,
  Alert,
  FlatList,
} from "react-native";
import PrivateChatMessage from "../../components/PrivateChatMessage";
import {
  ArrowLeft,
  MoreVertical,
  Mic,
  Send,
  SmileIcon,
  StopCircle,
  Pause,
  Play,
  Bell,
  BellOff,
  Ban,
  Flag,
  Trash2,
  X,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import RecordVoiceModal from "../../components/RecordVoiceModal";
import SimpleVoiceRecorder from "../../components/SimpleVoiceRecorder";

export default function PrivateChatScreen() {
  const router = useRouter();
  const { userId, username, userAvatar } = useLocalSearchParams();
  const { theme } = useTheme();
  const [messageText, setMessageText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [messages, setMessages] = useState([]);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollViewRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Initialize with mock data for messages
  useEffect(() => {
    setMessages([
      {
        id: "1",
        sender: "other",
        text: "Hey! I listened to your voice message. It really resonated with me.",
        time: "10:30 AM",
        isVoice: false,
      },
      {
        id: "2",
        sender: "me",
        text: "Thank you! I'm glad it helped. Sometimes it's just nice to know someone understands.",
        time: "10:32 AM",
        isVoice: false,
        read: true,
      },
      {
        id: "3",
        sender: "other",
        time: "10:35 AM",
        isVoice: true,
        duration: "0:42",
        progress: 0.33,
      },
    ]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Also scroll to bottom when component mounts
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Toggle recording state
  const toggleRecording = () => {
    setShowVoiceModal(true);
    // Hide keyboard if it's open
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  // Send text message
  const sendTextMessage = () => {
    if (messageText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isVoice: false,
      read: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText("");

    // Ensure scroll to bottom after sending a message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Handle report user
  const handleReportUser = (reason) => {
    // Here we would call an API to report the user
    Alert.alert(
      "User Reported",
      `Thank you for your report. We'll review ${username}'s account for ${reason.toLowerCase()}.`,
      [{ text: "OK" }],
    );
  };

  // Send voice message
  const saveVoiceMessage = (recordingData) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isVoice: true,
      duration: formatTime(recordingData.duration),
      progress: 0,
      read: false,
    };

    setMessages([...messages, newMessage]);
    setShowVoiceModal(false);

    // Ensure scroll to bottom after sending a voice message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Use the PrivateChatMessage component to render messages
  const renderMessage = (message) => (
    <PrivateChatMessage
      key={message.id}
      id={message.id}
      sender={message.sender}
      text={message.text}
      time={message.time}
      isVoice={message.isVoice}
      duration={message.duration}
      progress={message.progress}
      read={message.read}
      userAvatar={userAvatar as string}
      onPlay={() => console.log(`Playing voice message ${message.id}`)}
    />
  );

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-white"}`}
      style={{
        paddingTop:
          Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
      }}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#ffffff"}
        translucent={true}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Chat Header */}
        <View
          className={`${theme === "dark" ? "bg-[#111112]/90 border-gray-800" : "bg-white border-gray-100"} px-4 py-3 border-b shadow-sm`}
          style={{
            shadowColor: theme === "dark" ? "#000" : "#e2e8f0",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: theme === "dark" ? 0.2 : 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <ArrowLeft
                  size={20}
                  color={theme === "dark" ? "#9ca3af" : "#4b5563"}
                />
              </TouchableOpacity>
              <Image
                source={{ uri: userAvatar }}
                className="w-10 h-10 rounded-full"
              />
              <View>
                <Text
                  className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  {username}
                </Text>
                <Text className="text-xs text-green-500">Online</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowOptionsMenu(true)}
            >
              <MoreVertical
                size={20}
                color={theme === "dark" ? "#e5e7eb" : "#111827"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options Menu Modal */}
        <Modal
          visible={showOptionsMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowOptionsMenu(false)}
          statusBarTranslucent={true}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              activeOpacity={1}
              onPress={() => setShowOptionsMenu(false)}
            />
            <View
              className={`absolute top-16 right-4 ${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl shadow-xl p-1 w-48 z-50`}
              style={{
                shadowColor: theme === "dark" ? "#000" : "#e2e8f0",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: theme === "dark" ? 0.3 : 0.15,
                shadowRadius: 4,
                elevation: 5,
              }}
              pointerEvents="auto"
            >
              <TouchableOpacity
                className={`flex-row items-center p-3 ${theme === "dark" ? "hover:bg-[#2a2a2e]" : "hover:bg-gray-100"} rounded-lg`}
                onPress={() => {
                  console.log("Mute notifications pressed");
                  setShowOptionsMenu(false);
                  Alert.alert(
                    "Notifications Muted",
                    `You will no longer receive notifications from ${username}`,
                    [{ text: "OK" }],
                  );
                }}
                activeOpacity={0.7}
              >
                <BellOff size={18} color="#8b5cf6" />
                <Text
                  className={`ml-3 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Mute Notifications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center p-3 ${theme === "dark" ? "hover:bg-[#2a2a2e]" : "hover:bg-gray-100"} rounded-lg`}
                onPress={() => {
                  console.log("Block user pressed");
                  setShowOptionsMenu(false);
                  Alert.alert(
                    "Block User",
                    `Are you sure you want to block ${username}? You won't be able to receive messages from them anymore.`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Block",
                        style: "destructive",
                        onPress: () => {
                          // Here we would call an API to block the user
                          Alert.alert(
                            "User Blocked",
                            `${username} has been blocked. You can unblock them from your settings.`,
                            [{ text: "OK", onPress: () => router.back() }],
                          );
                        },
                      },
                    ],
                  );
                }}
                activeOpacity={0.7}
              >
                <Ban size={18} color="#8b5cf6" />
                <Text
                  className={`ml-3 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Block User
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center p-3 ${theme === "dark" ? "hover:bg-[#2a2a2e]" : "hover:bg-gray-100"} rounded-lg`}
                onPress={() => {
                  console.log("Report user pressed");
                  setShowOptionsMenu(false);
                  Alert.alert(
                    "Report User",
                    "Please select a reason for reporting this user:",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Harassment",
                        onPress: () => handleReportUser("Harassment"),
                      },
                      {
                        text: "Inappropriate Content",
                        onPress: () =>
                          handleReportUser("Inappropriate Content"),
                      },
                      {
                        text: "Spam",
                        onPress: () => handleReportUser("Spam"),
                      },
                      {
                        text: "Other",
                        onPress: () => handleReportUser("Other"),
                      },
                    ],
                  );
                }}
                activeOpacity={0.7}
              >
                <Flag size={18} color="#8b5cf6" />
                <Text
                  className={`ml-3 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                >
                  Report User
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center p-3 ${theme === "dark" ? "hover:bg-[#2a2a2e]" : "hover:bg-gray-100"} rounded-lg`}
                onPress={() => {
                  console.log("Delete conversation pressed");
                  setShowOptionsMenu(false);
                  Alert.alert(
                    "Delete Conversation",
                    "Are you sure you want to delete this entire conversation? This action cannot be undone.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          // Here we would call an API to delete the conversation
                          setMessages([]);
                          Alert.alert(
                            "Conversation Deleted",
                            "This conversation has been deleted.",
                            [{ text: "OK", onPress: () => router.back() }],
                          );
                        },
                      },
                    ],
                  );
                }}
                activeOpacity={0.7}
              >
                <Trash2 size={18} color="#ef4444" />
                <Text className="ml-3 text-red-500">Delete Conversation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Voice Recording Modal */}
        <SimpleVoiceRecorder
          visible={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          onSave={saveVoiceMessage}
        />

        {/* Emoji Picker Modal */}
        <Modal
          visible={showEmojiPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEmojiPicker(false)}
          statusBarTranslucent={true}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
            activeOpacity={1}
            onPress={() => setShowEmojiPicker(false)}
          >
            <View
              className={`absolute bottom-0 w-full ${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-t-xl p-4`}
              style={{ maxHeight: "40%" }}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Emojis
                </Text>
                <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
                  <X
                    size={24}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                data={[
                  "😀",
                  "😃",
                  "😄",
                  "😁",
                  "😆",
                  "😅",
                  "😂",
                  "🤣",
                  "😊",
                  "😇",
                  "🙂",
                  "🙃",
                  "😉",
                  "😌",
                  "😍",
                  "🥰",
                  "😘",
                  "😗",
                  "😙",
                  "😚",
                  "😋",
                  "😛",
                  "😝",
                  "😜",
                  "🤪",
                  "🤨",
                  "🧐",
                  "🤓",
                  "😎",
                  "🤩",
                  "🥳",
                  "😏",
                  "😒",
                  "😞",
                  "😔",
                  "😟",
                  "😕",
                  "🙁",
                  "☹️",
                  "😣",
                  "❤️",
                  "🧡",
                  "💛",
                  "💚",
                  "💙",
                  "💜",
                  "🖤",
                  "💔",
                  "❣️",
                  "💕",
                  "👍",
                  "👎",
                  "👏",
                  "🙌",
                  "👐",
                  "🤲",
                  "🤝",
                  "🙏",
                  "✌️",
                  "🤞",
                ]}
                numColumns={8}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => {
                      setMessageText(messageText + item);
                      setShowEmojiPicker(false);
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Messages Area */}
        <ScrollView
          ref={scrollViewRef}
          className={`flex-1 px-4 pt-2 pb-20 ${theme === "dark" ? "bg-[#111112]" : "bg-white"}`}
          showsVerticalScrollIndicator={false}
        >
          {/* Date Separator */}
          <View className="flex-row justify-center my-4">
            <View
              className={`px-4 py-1 ${theme === "dark" ? "bg-[#202024]" : "bg-gray-100"} rounded-full shadow-sm`}
              style={{
                shadowColor: theme === "dark" ? "#000" : "#e2e8f0",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: theme === "dark" ? 0.2 : 0.1,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text
                className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Today
              </Text>
            </View>
          </View>

          {/* Messages */}
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input Area */}
        <View
          className={`absolute bottom-0 w-full ${theme === "dark" ? "bg-[#111112]/90 border-gray-800" : "bg-white border-gray-100"} border-t px-4 py-3 shadow-sm`}
          style={{
            shadowColor: theme === "dark" ? "#000" : "#e2e8f0",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: theme === "dark" ? 0.2 : 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className={`w-10 h-10 ${isRecording ? "bg-red-500" : theme === "dark" ? "bg-[#202024]" : "bg-gray-100"} rounded-full items-center justify-center shadow-sm`}
              activeOpacity={0.7}
              onPress={toggleRecording}
              style={{
                shadowColor: theme === "dark" ? "#000" : "#94a3b8",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: theme === "dark" ? 0.3 : 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Mic size={20} color={theme === "dark" ? "#9ca3af" : "#6b7280"} />
            </TouchableOpacity>
            <View
              className={`flex-1 ${theme === "dark" ? "bg-[#202024]" : "bg-gray-50"} rounded-full px-4 py-2 flex-row items-center shadow-inner`}
              style={{
                shadowColor: theme === "dark" ? "#000" : "#94a3b8",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: theme === "dark" ? 0.2 : 0.1,
                shadowRadius: 1,
                elevation: 1,
              }}
            >
              <TextInput
                className={`flex-1 ${theme === "dark" ? "text-white" : "text-[#111827]"} text-sm`}
                placeholder="Type a message..."
                placeholderTextColor={theme === "dark" ? "#9ca3af" : "#94a3b8"}
                value={messageText}
                onChangeText={setMessageText}
                onSubmitEditing={sendTextMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowEmojiPicker(true)}
              >
                <SmileIcon
                  size={20}
                  color={theme === "dark" ? "#9ca3af" : "#94a3b8"}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="w-10 h-10 bg-purple-500 rounded-full items-center justify-center shadow-sm"
              activeOpacity={0.7}
              onPress={sendTextMessage}
              disabled={messageText.trim() === ""}
              style={{
                opacity: messageText.trim() === "" ? 0.5 : 1,
                shadowColor: "#7c3aed",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <Send size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
