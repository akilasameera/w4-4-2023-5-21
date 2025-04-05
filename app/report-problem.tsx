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
import { ArrowLeft, AlertTriangle } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";

export default function ReportProblemScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");

  const problemTypes = [
    "App Crash",
    "Audio Issues",
    "Login Problems",
    "Content Not Loading",
    "Inappropriate Content",
    "Account Issues",
    "Other",
  ];

  const handleSubmit = () => {
    if (!problemType) {
      Alert.alert("Error", "Please select a problem type");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please describe the problem");
      return;
    }

    // In a real app, this would send the report to the backend
    Alert.alert(
      "Report Submitted",
      "Thank you for your report. Our team will investigate the issue.",
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
            Report a Problem
          </Text>
        </View>
      </View>

      <ScrollView
        className={`flex-1 px-4 py-4 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`mb-6 p-4 rounded-lg flex-row items-center ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
        >
          <AlertTriangle size={20} color="#f59e0b" className="mr-3" />
          <Text
            className={`flex-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Help us improve WhisperWall by reporting any issues you encounter.
            Your feedback is valuable to us.
          </Text>
        </View>

        {/* Problem Type Selection */}
        <View className="mb-6">
          <Text
            className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Problem Type
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {problemTypes.map((type) => (
              <TouchableOpacity
                key={type}
                className={`px-3 py-2 rounded-lg mb-2 ${problemType === type ? "bg-purple-600" : theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
                onPress={() => setProblemType(type)}
              >
                <Text
                  className={`${problemType === type ? "text-white" : theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Field */}
        <View className="mb-6">
          <Text
            className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Problem Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Please describe the issue in detail. Include steps to reproduce if possible."
            multiline
            numberOfLines={6}
            className={`p-3 rounded-lg ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-[#111827] border border-gray-200"} min-h-[150px] textAlignVertical-top`}
            placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            textAlignVertical="top"
          />
        </View>

        {/* Device Info Notice */}
        <View className="mb-6">
          <Text
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Note: Basic device information will be included with your report to
            help us diagnose the issue.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-purple-600 py-3 px-4 rounded-lg items-center mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            Submit Report
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
