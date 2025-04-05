import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Save } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";

export default function DataSharingScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // Data sharing preferences
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);
  const [thirdPartyEnabled, setThirdPartyEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [crashReportingEnabled, setCrashReportingEnabled] = useState(true);

  const handleSavePreferences = () => {
    // In a real app, this would save preferences to the user's account
    Alert.alert(
      "Preferences Saved",
      "Your data sharing preferences have been updated.",
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
            Data Sharing
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
          Control how your data is used and shared. These settings affect your
          experience and the services we can provide.
        </Text>

        {/* Data Sharing Options */}
        <View
          className={`rounded-xl overflow-hidden mb-6 ${theme === "dark" ? "bg-[#202024]" : "bg-white"} shadow-sm`}
          style={{
            shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          {/* Analytics */}
          <View
            className={`p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
          >
            <View className="flex-1 mr-4">
              <Text
                className={`font-medium mb-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Usage Analytics
              </Text>
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Allow us to collect anonymous data about how you use the app to
                improve our services.
              </Text>
            </View>
            <Switch
              trackColor={{
                false: theme === "dark" ? "#2a2a2e" : "#d1d5db",
                true: "#8b5cf6",
              }}
              thumbColor={"#ffffff"}
              ios_backgroundColor={theme === "dark" ? "#2a2a2e" : "#d1d5db"}
              onValueChange={setAnalyticsEnabled}
              value={analyticsEnabled}
            />
          </View>

          {/* Personalization */}
          <View
            className={`p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
          >
            <View className="flex-1 mr-4">
              <Text
                className={`font-medium mb-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Personalized Content
              </Text>
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Allow us to use your activity to personalize your feed and
                recommendations.
              </Text>
            </View>
            <Switch
              trackColor={{
                false: theme === "dark" ? "#2a2a2e" : "#d1d5db",
                true: "#8b5cf6",
              }}
              thumbColor={"#ffffff"}
              ios_backgroundColor={theme === "dark" ? "#2a2a2e" : "#d1d5db"}
              onValueChange={setPersonalizationEnabled}
              value={personalizationEnabled}
            />
          </View>

          {/* Third-party Sharing */}
          <View
            className={`p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
          >
            <View className="flex-1 mr-4">
              <Text
                className={`font-medium mb-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Third-party Data Sharing
              </Text>
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Allow us to share anonymized data with trusted third parties for
                research and development.
              </Text>
            </View>
            <Switch
              trackColor={{
                false: theme === "dark" ? "#2a2a2e" : "#d1d5db",
                true: "#8b5cf6",
              }}
              thumbColor={"#ffffff"}
              ios_backgroundColor={theme === "dark" ? "#2a2a2e" : "#d1d5db"}
              onValueChange={setThirdPartyEnabled}
              value={thirdPartyEnabled}
            />
          </View>

          {/* Location Data */}
          <View
            className={`p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
          >
            <View className="flex-1 mr-4">
              <Text
                className={`font-medium mb-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Location Data
              </Text>
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Allow us to use your location data to provide location-based
                features.
              </Text>
            </View>
            <Switch
              trackColor={{
                false: theme === "dark" ? "#2a2a2e" : "#d1d5db",
                true: "#8b5cf6",
              }}
              thumbColor={"#ffffff"}
              ios_backgroundColor={theme === "dark" ? "#2a2a2e" : "#d1d5db"}
              onValueChange={setLocationEnabled}
              value={locationEnabled}
            />
          </View>

          {/* Crash Reporting */}
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text
                className={`font-medium mb-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                Crash Reporting
              </Text>
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Allow us to collect crash reports to improve app stability.
              </Text>
            </View>
            <Switch
              trackColor={{
                false: theme === "dark" ? "#2a2a2e" : "#d1d5db",
                true: "#8b5cf6",
              }}
              thumbColor={"#ffffff"}
              ios_backgroundColor={theme === "dark" ? "#2a2a2e" : "#d1d5db"}
              onValueChange={setCrashReportingEnabled}
              value={crashReportingEnabled}
            />
          </View>
        </View>

        {/* Data Retention Info */}
        <View
          className={`p-4 rounded-xl mb-6 ${theme === "dark" ? "bg-[#202024]" : "bg-white"} shadow-sm`}
          style={{
            shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text
            className={`font-medium mb-2 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            Data Retention
          </Text>
          <Text
            className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            We retain your personal data for as long as your account is active
            or as needed to provide you services. You can request deletion of
            your data at any time by deleting your account.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/privacy-policy")}
            className="mt-1"
          >
            <Text className="text-purple-500 text-sm">View Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSavePreferences}
          className="bg-purple-600 py-3 px-4 rounded-lg items-center mb-8 flex-row justify-center"
          activeOpacity={0.8}
        >
          <Save size={18} color="#ffffff" className="mr-2" />
          <Text className="text-white font-semibold text-base">
            Save Preferences
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
