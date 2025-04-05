import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Send, Mail, MessageSquare } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";

export default function ContactSupportScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contactMethod, setContactMethod] = useState("email");

  const handleSubmit = () => {
    if (!subject.trim()) {
      Alert.alert("Error", "Please enter a subject");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Error", "Please enter your message");
      return;
    }

    // In a real app, this would send the support request to the backend
    Alert.alert(
      "Support Request Sent",
      "Thank you for contacting us. Our team will get back to you shortly.",
      [{ text: "OK", onPress: () => router.back() }],
    );
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
          <Text
            className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            Contact Support
          </Text>
        </View>
      </View>

      <ScrollView
        className={`flex-1 px-4 py-4 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={`text-base mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
        >
          Our support team is here to help. Please fill out the form below and
          we'll get back to you as soon as possible.
        </Text>

        {/* Contact Method Selection */}
        <View className="mb-6">
          <Text
            className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Preferred Contact Method
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center p-3 rounded-lg ${contactMethod === "email" ? "bg-purple-600" : theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
              onPress={() => setContactMethod("email")}
            >
              <Mail
                size={18}
                color={
                  contactMethod === "email"
                    ? "#ffffff"
                    : theme === "dark"
                      ? "#9ca3af"
                      : "#6b7280"
                }
                className="mr-2"
              />
              <Text
                className={`${contactMethod === "email" ? "text-white" : theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 flex-row items-center justify-center p-3 rounded-lg ${contactMethod === "chat" ? "bg-purple-600" : theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
              onPress={() => setContactMethod("chat")}
            >
              <MessageSquare
                size={18}
                color={
                  contactMethod === "chat"
                    ? "#ffffff"
                    : theme === "dark"
                      ? "#9ca3af"
                      : "#6b7280"
                }
                className="mr-2"
              />
              <Text
                className={`${contactMethod === "chat" ? "text-white" : theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                Live Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View className="space-y-4 mb-6">
          <View>
            <Text
              className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Subject
            </Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="What do you need help with?"
              className={`p-3 rounded-lg ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-[#111827] border border-gray-200"}`}
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            />
          </View>

          <View>
            <Text
              className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Message
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Please describe your issue in detail"
              multiline
              numberOfLines={6}
              className={`p-3 rounded-lg ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-[#111827] border border-gray-200"} min-h-[150px] textAlignVertical-top`}
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-purple-600 py-3 px-4 rounded-lg items-center mb-8 flex-row justify-center"
          activeOpacity={0.8}
        >
          <Send size={18} color="#ffffff" className="mr-2" />
          <Text className="text-white font-semibold text-base">
            Send Message
          </Text>
        </TouchableOpacity>

        {/* Alternative Contact Info */}
        <View
          className={`p-4 rounded-lg mb-8 ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
        >
          <Text
            className={`font-medium mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            Alternative Contact Methods
          </Text>
          <Text
            className={`mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Email: support@whisperwall.com
          </Text>
          <Text
            className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Support Hours: Monday-Friday, 9am-5pm EST
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
