import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";

export default function SupportChatScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "system",
      message: "Welcome to WhisperWall Support! How can we help you today?",
      timestamp: new Date(Date.now() - 60000 * 5),
    },
  ]);
  const scrollViewRef = useRef(null);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: chatHistory.length + 1,
      sender: "user",
      message: message.trim(),
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");

    // Simulate support agent response after a short delay
    setTimeout(() => {
      const supportResponse = {
        id: chatHistory.length + 2,
        sender: "system",
        message:
          "Thanks for reaching out! This is a demo of the support chat interface. In a real app, this would connect you with a support agent. How else can I assist you?",
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, supportResponse]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-[#f9fafb]"}`}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#f9fafb]"}
      />

      {/* Header */}
      <View
        className={`${theme === "dark" ? "bg-[#111112]/90 border-gray-800" : "bg-[#f9fafb]/90 border-gray-200"} px-4 py-3 border-b`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="mr-3"
            >
              <ArrowLeft
                size={24}
                color={theme === "dark" ? "#ffffff" : "#111827"}
              />
            </TouchableOpacity>
            <View>
              <Text
                className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Support Chat
              </Text>
              <Text
                className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Typically replies within minutes
              </Text>
            </View>
          </View>
          <View
            className={`w-2 h-2 rounded-full bg-green-500 ${theme === "dark" ? "border border-gray-800" : "border border-white"}`}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          className={`flex-1 px-4 py-4 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {chatHistory.map((chat) => (
            <View
              key={chat.id}
              className={`mb-4 max-w-[80%] ${chat.sender === "user" ? "self-end ml-auto" : "self-start"}`}
            >
              <View
                className={`p-3 rounded-2xl ${chat.sender === "user" ? "bg-purple-600" : theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
              >
                <Text
                  className={`${chat.sender === "user" ? "text-white" : theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  {chat.message}
                </Text>
              </View>
              <Text
                className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"} ${chat.sender === "user" ? "text-right" : "text-left"}`}
              >
                {formatTime(chat.timestamp)}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Message Input */}
        <View
          className={`px-4 py-2 border-t ${theme === "dark" ? "bg-[#202024] border-gray-800" : "bg-white border-gray-200"}`}
        >
          <View className="flex-row items-center">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
              className={`flex-1 p-2 rounded-full mr-2 ${theme === "dark" ? "bg-[#111112] text-white" : "bg-gray-100 text-[#111827]"}`}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!message.trim()}
              className={`w-10 h-10 rounded-full items-center justify-center ${message.trim() ? "bg-purple-600" : theme === "dark" ? "bg-[#2a2a2e]" : "bg-gray-200"}`}
            >
              <Send
                size={18}
                color={
                  message.trim()
                    ? "#ffffff"
                    : theme === "dark"
                      ? "#9ca3af"
                      : "#6b7280"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
