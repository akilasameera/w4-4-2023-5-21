import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../src/contexts/ThemeContext";
import BottomNavigation from "../components/BottomNavigation";
import SimpleVoiceRecorder from "../components/SimpleVoiceRecorder";
import {
  MessageSquare,
  Search,
  User,
  Home,
  Compass,
  Mic,
} from "lucide-react-native";

export default function ChatScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const { theme } = useTheme();

  // Chat requests data
  const chatRequests = [
    {
      id: "1",
      name: "Michael Wright",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
      message: "Would like to connect with you",
    },
  ];

  // Active chats data
  const activeChats = [
    {
      id: "1",
      name: "Emma Wilson",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
      lastMessage: "Voice message (0:42)",
      time: "2:34 PM",
      unread: 0,
      online: true,
      isVoice: true,
    },
    {
      id: "2",
      name: "David Kim",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
      lastMessage: "Thank you for listening to my story...",
      time: "Yesterday",
      unread: 2,
      online: false,
      isVoice: false,
    },
    {
      id: "3",
      name: "Sophie Martinez",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg",
      lastMessage: "Voice message (1:15)",
      time: "Yesterday",
      unread: 0,
      online: true,
      isVoice: true,
    },
  ];

  const handleNewChat = () => {
    // Handle new chat action
  };

  const handleVoiceRecording = () => {
    setShowVoiceRecorder(true);
  };

  const handleSaveRecording = (recordingData: any) => {
    console.log("Recording saved:", recordingData);
    // Here you would typically handle the saved recording
    // For example, send it to a chat or save it locally
  };

  const handleChatSelect = (chat) => {
    router.push({
      pathname: `/private-chat/${chat.id}`,
      params: { username: chat.name, userAvatar: chat.avatar },
    });
  };

  const renderChatRequestItem = ({ item }) => (
    <View
      className={`bg-${theme === "dark" ? "[#202024]" : "white"} rounded-xl p-4 mb-4 shadow-lg`}
    >
      <View className="flex-row items-center gap-3">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1">
          <Text
            className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            {item.name}
          </Text>
          <Text
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            {item.message}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="px-3 py-1.5 bg-purple-500 rounded-full"
            onPress={() => {
              // Accept chat request
              console.log(`Accepted chat request from ${item.name}`);
              // Here you would typically update the database
              // and move this chat to active chats
            }}
            activeOpacity={0.7}
          >
            <Text className="text-sm text-white">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-3 py-1.5 bg-${theme === "dark" ? "[#2a2a2e]" : "gray-200"} rounded-full`}
            onPress={() => {
              // Decline chat request
              console.log(`Declined chat request from ${item.name}`);
              // Here you would typically update the database
              // and remove this chat request
            }}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-700"}`}
            >
              Decline
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderActiveChatItem = ({ item }) => (
    <TouchableOpacity
      className={`bg-${theme === "dark" ? "[#202024]" : "white"} rounded-xl p-4 mb-4 shadow-lg`}
      activeOpacity={0.7}
      onPress={() => handleChatSelect(item)}
    >
      <View className="flex-row items-center gap-3">
        <View className="relative">
          <Image
            source={{ uri: item.avatar }}
            className="w-12 h-12 rounded-full"
          />
          {item.online && (
            <View
              className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 ${theme === "dark" ? "border-[#202024]" : "border-white"}`}
            />
          )}
          {!item.online && (
            <View
              className={`absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 ${theme === "dark" ? "border-[#202024]" : "border-white"}`}
            />
          )}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              {item.name}
            </Text>
            <Text
              className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {item.time}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {item.isVoice && <Mic size={12} color="#8b5cf6" />}
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} truncate`}
            >
              {item.lastMessage}
            </Text>
          </View>
        </View>
        {item.unread > 0 && (
          <View className="w-5 h-5 bg-purple-500 rounded-full items-center justify-center">
            <Text className="text-xs text-white">{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-white"}`}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#ffffff"}
      />

      {/* Header */}
      <View
        className={`${theme === "dark" ? "bg-[#111112]/90 border-gray-800" : "bg-white/90 border-gray-200"} px-4 py-3 border-b`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MessageSquare size={24} color="#8b5cf6" />
            <Text
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              Private Chats
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <Image
              source={{
                uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
              }}
              className="w-8 h-8 rounded-full"
            />
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-3">
          <View className="relative">
            <View className="absolute left-3 top-2.5 z-10">
              <Search
                size={16}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </View>
            <TextInput
              className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-[#f3f4f6] text-[#111827]"} rounded-full py-2 pl-10 pr-4 text-sm`}
              placeholder="Search conversations..."
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="pt-4 pb-20 px-4 flex-1">
        {/* Chat Requests Section */}
        <View className="mb-6">
          <Text
            className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
          >
            Chat Requests
          </Text>
          <FlatList
            data={chatRequests}
            renderItem={renderChatRequestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Active Chats */}
        <View>
          <Text
            className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
          >
            Active Chats
          </Text>
          <FlatList
            data={activeChats}
            renderItem={renderActiveChatItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
      />

      {/* Simple Voice Recorder Modal */}
      <SimpleVoiceRecorder
        visible={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
        onSave={handleSaveRecording}
      />
    </SafeAreaView>
  );
}
