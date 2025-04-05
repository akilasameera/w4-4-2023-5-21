import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { ArrowLeft, Camera } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Sarah Chen",
    username: "@sarahchen",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    bio: "Sharing stories through voice 🎤",
  });

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle profile picture update
  const handleUpdateProfilePicture = () => {
    // In a real app, this would open image picker
    alert("Profile picture update functionality would open here");
  };

  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, this would save to database
    alert("Changes saved successfully!");
    router.back();
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
          Edit Profile
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View className="items-center my-6">
          <View className="relative">
            <Image
              source={{ uri: userData.avatar }}
              className="w-24 h-24 rounded-full border-2 border-purple-500"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 w-8 h-8 bg-purple-500 rounded-full items-center justify-center shadow-lg"
              activeOpacity={0.7}
              onPress={handleUpdateProfilePicture}
            >
              <Camera size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text
            className={`text-sm mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Tap to change profile picture
          </Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-4 mb-6">
          <View>
            <Text
              className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Name
            </Text>
            <TextInput
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              className={`p-3 rounded-lg ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-[#111827] border border-gray-200"}`}
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            />
          </View>

          <View>
            <Text
              className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Username
            </Text>
            <TextInput
              value={userData.username}
              onChangeText={(text) =>
                setUserData({ ...userData, username: text })
              }
              className={`p-3 rounded-lg ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-[#111827] border border-gray-200"}`}
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            />
          </View>

          <View>
            <Text
              className={`text-sm mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Bio
            </Text>
            <TextInput
              value={userData.bio}
              onChangeText={(text) => setUserData({ ...userData, bio: text })}
              multiline
              numberOfLines={4}
              className={`p-3 rounded-lg ${theme === "dark" ? "bg-[#202024] text-white" : "bg-white text-[#111827] border border-gray-200"} min-h-[100px] textAlignVertical-top`}
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSaveChanges}
          className="bg-purple-600 py-3 px-4 rounded-lg items-center mb-8"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
