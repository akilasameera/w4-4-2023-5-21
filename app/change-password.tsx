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
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";
import { useRouter } from "expo-router";

export default function ChangePasswordScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle password change
  const handleChangePassword = () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    // In a real app, this would call an API to change the password
    Alert.alert("Success", "Password changed successfully", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-[#f9fafb]"}`}
      style={{ paddingTop: StatusBar.currentHeight || 0 }}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#f9fafb"}
        translucent={true}
      />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={handleBack} className="p-1">
          <ArrowLeft
            size={24}
            color={theme === "dark" ? "#ffffff" : "#111827"}
          />
        </TouchableOpacity>
        <Text
          className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
        >
          Change Password
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-6 mb-4">
          <Text
            className={`text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-4`}
          >
            Create a new password that is at least 8 characters long. A strong
            password contains a mix of letters, numbers, and symbols.
          </Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-4 mb-6">
          {/* Current Password */}
          <View>
            <Text
              className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Current Password
            </Text>
            <View
              className={`flex-row items-center p-3 rounded-lg ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
            >
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                className={`flex-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
                placeholder="Enter current password"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff
                    size={20}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                ) : (
                  <Eye
                    size={20}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View>
            <Text
              className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              New Password
            </Text>
            <View
              className={`flex-row items-center p-3 rounded-lg ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
            >
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                className={`flex-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
                placeholder="Enter new password"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff
                    size={20}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                ) : (
                  <Eye
                    size={20}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm New Password */}
          <View>
            <Text
              className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Confirm New Password
            </Text>
            <View
              className={`flex-row items-center p-3 rounded-lg ${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"}`}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className={`flex-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
                placeholder="Confirm new password"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff
                    size={20}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                ) : (
                  <Eye
                    size={20}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleChangePassword}
          className="bg-purple-600 py-3 px-4 rounded-lg items-center mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            Update Password
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
