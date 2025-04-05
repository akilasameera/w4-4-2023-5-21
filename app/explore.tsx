import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomNavigation from "../components/BottomNavigation";
import { useTheme } from "../src/contexts/ThemeContext";
import VoiceCard from "../components/VoiceCard";
import { usePopularVoices } from "../src/hooks/usePopularVoices";

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const router = useRouter();

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
          <View className="flex-row items-center gap-2">
            <FontAwesome name="microphone" size={20} color="#8b5cf6" />
            <Text
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              WhisperWall
            </Text>
          </View>
          <View>
            <TouchableOpacity
              className={`w-8 h-8 ${theme === "dark" ? "bg-[#202024]" : "bg-[#e5e7eb]"} rounded-full items-center justify-center`}
              onPress={() => router.push("/settings")}
            >
              <FontAwesome
                name="sliders"
                size={16}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-3">
          <View className="relative">
            <View className="absolute left-3 top-2.5 z-10">
              <FontAwesome
                name="search"
                size={16}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </View>
            <TextInput
              className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-[#f3f4f6] text-[#111827]"} rounded-full py-2 pl-10 pr-4 text-sm`}
              placeholder="Discover voices and people..."
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if (searchQuery.trim().length > 0) {
                  // Handle search submission
                  console.log("Searching for:", searchQuery);
                  // In a real app, this would filter content based on the query
                }
              }}
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className={`flex-1 pt-4 pb-20 px-4 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
      >
        {/* Trending Section */}
        <View className="mb-6">
          <Text
            className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            Trending Now
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-3 pb-2"
          >
            <TrendingCard
              name="Mike Rodriguez"
              location="Trending in USA"
              listeners="2.5k"
              avatar="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
              theme={theme}
            />
            <TrendingCard
              name="Emma Wilson"
              location="Global Trending"
              listeners="1.8k"
              avatar="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg"
              theme={theme}
            />
          </ScrollView>
        </View>

        {/* Recommended Users */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              Recommended for You
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/explore/recommended")}
            >
              <Text className="text-sm text-purple-400">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between">
            <UserCard
              name="Lisa Park"
              followers="420"
              avatar="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg"
              theme={theme}
            />
            <UserCard
              name="David Kim"
              followers="891"
              avatar="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg"
              theme={theme}
            />
          </View>
        </View>

        {/* Popular Voices */}
        <View>
          <View className="flex-row justify-between items-center mb-3">
            <Text
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              Popular Voices
            </Text>
            <TouchableOpacity onPress={() => router.push("/explore/popular")}>
              <Text className="text-sm text-purple-400">See All</Text>
            </TouchableOpacity>
          </View>

          <PopularVoicesSection theme={theme} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
      />
    </SafeAreaView>
  );
}

const TrendingCard = ({
  name,
  location,
  listeners,
  avatar,
  theme = "dark",
}) => {
  return (
    <View
      className={`min-w-[280px] ${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-3 mr-3`}
    >
      <View className="flex-row items-center gap-3 mb-2">
        <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full" />
        <View>
          <Text
            className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            {name}
          </Text>
          <Text
            className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            {location}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <FontAwesome name="fire" size={14} color="#f59e0b" />
        <Text
          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          {listeners} listeners
        </Text>
      </View>
    </View>
  );
};

const UserCard = ({ name, followers, avatar, theme = "dark" }) => {
  const router = useRouter();

  return (
    <View
      className={`w-[48%] ${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-3`}
    >
      <View className="flex-row items-center gap-3 mb-3">
        <Image source={{ uri: avatar }} className="w-12 h-12 rounded-full" />
        <View>
          <Text
            className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            {name}
          </Text>
          <Text
            className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            {followers} followers
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="w-full py-1.5 bg-purple-500 rounded-full items-center"
        onPress={() => {
          // In a real app, this would call an API to follow the user
          console.log(`Following ${name}`);
          // You could add state management here to toggle the button text between Follow/Following
        }}
      >
        <Text className="text-sm text-white">Follow</Text>
      </TouchableOpacity>
    </View>
  );
};

// Popular Voices Section Component
const PopularVoicesSection = ({ theme }) => {
  const { voices, loading, error } = usePopularVoices(3);

  if (loading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text
          className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Loading popular voices...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center py-8">
        <Text className={`text-red-500`}>{error}</Text>
      </View>
    );
  }

  if (voices.length === 0) {
    return (
      <View className="items-center justify-center py-8 bg-gray-100/10 rounded-xl">
        <FontAwesome name="microphone-slash" size={24} color="#9ca3af" />
        <Text
          className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          No popular voices found
        </Text>
      </View>
    );
  }

  return (
    <View>
      {voices.map((voice) => (
        <VoiceCard
          key={voice.id}
          id={voice.id}
          username={voice.username}
          userAvatar={voice.userAvatar}
          timeAgo={voice.timeAgo}
          language={voice.language}
          country={voice.country}
          mood={voice.mood}
          moodColor={voice.moodColor}
          duration={voice.duration}
          progress={0.33} // Default progress for display
          likes={voice.likes}
          comments={voice.comments}
          theme={theme}
        />
      ))}
    </View>
  );
};
