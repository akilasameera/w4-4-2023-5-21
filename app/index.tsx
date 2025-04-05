import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
} from "react-native";
import {
  Search,
  Bell,
  Sun,
  Moon,
  X,
  Home,
  Compass,
  MessageSquare,
  User,
  Settings,
  Mic,
  Share,
  LogOut,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import VoiceCard from "../components/VoiceCard";
import MoodFilter from "../components/MoodFilter";
import RecordVoiceModal from "../components/RecordVoiceModal";
import BottomNavigation from "../components/BottomNavigation";
import { useTheme } from "../src/contexts/ThemeContext";
import { getCountryFlag, getCountryList } from "../src/utils/countryFlags";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState("All");
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Load saved country on mount
  useEffect(() => {
    const loadSavedCountry = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem("selectedCountry");
        if (savedCountry) {
          setSelectedCountry(savedCountry);
        }
      } catch (error) {
        console.error("Error loading saved country:", error);
      }
    };

    loadSavedCountry();
  }, []);

  // Mock data for voice messages
  const voiceMessages = [
    {
      id: "1",
      user: {
        name: "Alex Thompson",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
        timeAgo: "2 hours ago",
        language: "English",
      },
      mood: "Excited",
      moodColor: "#8b5cf6",
      audioDuration: "1:24",
      progress: 0.33,
      likes: 24,
      comments: 8,
      country: "United States",
    },
    {
      id: "2",
      user: {
        name: "John Davis",
        avatar:
          "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
        timeAgo: "5 hours ago",
        language: "Mandarin",
      },
      mood: "Calm",
      moodColor: "#3b82f6",
      audioDuration: "2:45",
      progress: 0.66,
      likes: 42,
      comments: 15,
      country: "China",
    },
    {
      id: "3",
      user: {
        name: "Michael Wright",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        timeAgo: "1 day ago",
        language: "Spanish",
      },
      mood: "Happy",
      moodColor: "#10b981",
      audioDuration: "3:10",
      progress: 0.5,
      likes: 36,
      comments: 12,
      country: "Spain",
    },
    {
      id: "4",
      user: {
        name: "Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        timeAgo: "3 days ago",
        language: "French",
      },
      mood: "Stressed",
      moodColor: "#ef4444",
      audioDuration: "2:15",
      progress: 0.4,
      likes: 18,
      comments: 5,
      country: "France",
    },
    {
      id: "5",
      user: {
        name: "David Kim",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        timeAgo: "4 days ago",
        language: "Korean",
      },
      mood: "Anxious",
      moodColor: "#f59e0b",
      audioDuration: "1:45",
      progress: 0.6,
      likes: 29,
      comments: 7,
      country: "South Korea",
    },
  ];

  // Filter voice messages based on selected mood, search query, and country
  const filteredVoiceMessages = voiceMessages.filter((message) => {
    // Filter by mood
    const moodMatch = selectedMood === "All" || message.mood === selectedMood;

    // Filter by search query (language)
    const languageMatch =
      searchQuery === "" ||
      message.user.language.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by country
    const countryMatch =
      selectedCountry === "All" || message.country === selectedCountry;

    return moodMatch && languageMatch && countryMatch;
  });

  const handleTabPress = (tab: "home" | "explore" | "chat" | "profile") => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
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
      <View
        className={`${theme === "dark" ? "bg-[#111112]/90 border-gray-800" : "bg-[#f9fafb]/90 border-gray-200"} px-4 py-3 border-b`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={toggleSidebar}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
                }}
                className="w-8 h-8 rounded-full"
              />
            </TouchableOpacity>
            <Text
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              WhisperWall
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={toggleTheme}>
              {theme === "dark" ? (
                <Sun
                  size={20}
                  color={theme === "dark" ? "#e5e7eb" : "#4b5563"}
                />
              ) : (
                <Moon
                  size={20}
                  color={theme === "dark" ? "#e5e7eb" : "#4b5563"}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/notifications")}>
              <Bell
                size={20}
                color={theme === "dark" ? "#e5e7eb" : "#4b5563"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar and Country Filter */}
        <View className="mt-3">
          <View className="flex-row items-center gap-2">
            {/* Language Search Bar - Shortened */}
            <View className="relative flex-1">
              <View className="absolute left-3 top-2.5 z-10">
                <Search
                  size={16}
                  color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                />
              </View>
              <TextInput
                className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-[#f3f4f6] text-[#111827]"} rounded-full py-2 pl-10 pr-4 text-sm`}
                placeholder="Search by language..."
                placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Country Filter Dropdown */}
            <TouchableOpacity
              onPress={() => {
                // Create a modal with a scrollable list of countries
                setCountryModalVisible(true);
              }}
              className={`px-4 py-2 rounded-full ${theme === "dark" ? "bg-[#202024]" : "bg-[#f3f4f6]"} flex-row items-center`}
            >
              <Text
                className={`mr-1 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                {selectedCountry === "All"
                  ? "🌐"
                  : getCountryFlag(selectedCountry)}
              </Text>
              <Text
                className={`text-sm ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
              >
                {selectedCountry === "All" ? "All" : selectedCountry}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Mood Filter */}
      <MoodFilter
        selectedMood={selectedMood}
        onSelectMood={(mood) => setSelectedMood(mood)}
      />

      {/* Main Content */}
      <ScrollView
        className={`flex-1 px-4 pt-2 pb-20 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
      >
        {filteredVoiceMessages.map((message) => (
          <VoiceCard
            key={message.id}
            id={message.id}
            username={message.user.name}
            userAvatar={message.user.avatar}
            timeAgo={message.user.timeAgo}
            language={message.user.language}
            country={message.country}
            mood={message.mood}
            moodColor={message.moodColor}
            duration={message.audioDuration}
            progress={message.progress}
            likes={message.likes}
            comments={message.comments}
          />
        ))}
      </ScrollView>

      {/* Record Voice Modal */}
      <RecordVoiceModal
        visible={recordModalVisible}
        onClose={() => setRecordModalVisible(false)}
        onSave={(recordingData) => {
          console.log("Recording saved:", recordingData);
          setRecordModalVisible(false);
        }}
      />

      {/* Floating Record Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 16,
          bottom: 90,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#8b5cf6",
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
        }}
        onPress={() => setRecordModalVisible(true)}
        activeOpacity={0.8}
      >
        <Mic color="white" size={24} />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Country Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={countryModalVisible}
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            className={`${theme === "dark" ? "bg-[#111112]" : "bg-white"} rounded-t-3xl p-4`}
            style={{ maxHeight: "70%" }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Select Country
              </Text>
              <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
                <X size={24} color={theme === "dark" ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            </View>

            {/* Search bar for countries */}
            <View
              className={`flex-row items-center px-3 py-2 mb-3 rounded-lg ${theme === "dark" ? "bg-[#202024]" : "bg-gray-100"}`}
            >
              <Search
                size={18}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <TextInput
                className={`flex-1 ml-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                placeholder="Search countries"
                placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
                value={countrySearchQuery}
                onChangeText={setCountrySearchQuery}
              />
              {countrySearchQuery ? (
                <TouchableOpacity onPress={() => setCountrySearchQuery("")}>
                  <X
                    size={16}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView className="mb-4">
              {/* All Countries option */}
              <TouchableOpacity
                className={`px-4 py-3 mb-1 rounded-lg ${selectedCountry === "All" ? (theme === "dark" ? "bg-[#202024]" : "bg-gray-100") : ""}`}
                onPress={() => {
                  setSelectedCountry("All");
                  // Save selected country to AsyncStorage
                  AsyncStorage.setItem("selectedCountry", "All").catch(
                    (error) => console.error("Error saving country:", error),
                  );
                  setCountryModalVisible(false);
                }}
              >
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  🌐 All Countries
                </Text>
              </TouchableOpacity>

              {/* List of countries */}
              {getCountryList()
                .filter(
                  (country) =>
                    countrySearchQuery === "" ||
                    country
                      .toLowerCase()
                      .includes(countrySearchQuery.toLowerCase()),
                )
                .map((country) => (
                  <TouchableOpacity
                    key={country}
                    className={`px-4 py-3 mb-1 rounded-lg ${selectedCountry === country ? (theme === "dark" ? "bg-[#202024]" : "bg-gray-100") : ""}`}
                    onPress={() => {
                      setSelectedCountry(country);
                      // Save selected country to AsyncStorage
                      AsyncStorage.setItem("selectedCountry", country).catch(
                        (error) =>
                          console.error("Error saving country:", error),
                      );
                      setCountryModalVisible(false);
                    }}
                  >
                    <Text
                      className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                      {getCountryFlag(country)} {country}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Side Panel Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={toggleSidebar}
      >
        <View className="flex-1 flex-row">
          {/* Side Panel */}
          <View
            className={`w-[280px] h-full ${theme === "dark" ? "bg-[#111112]" : "bg-white"} shadow-xl border-r ${theme === "dark" ? "border-gray-800" : "border-gray-200"} rounded-tr-2xl rounded-br-2xl`}
            style={{
              transform: [{ translateX: sidebarVisible ? 0 : -300 }],
              transition: "0.3s",
            }}
          >
            {/* Header */}
            <View
              className={`p-4 flex-row items-center justify-between border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <View className="flex-row items-center gap-2">
                <Text className={`text-purple-500 font-bold text-xl`}>W</Text>
                <Text
                  className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  WhisperWall
                </Text>
              </View>
              <TouchableOpacity className="p-2" onPress={toggleSidebar}>
                <X size={20} color={theme === "dark" ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View
              className={`p-4 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <View className="flex-row items-center gap-3">
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
                  }}
                  className="w-12 h-12 rounded-full"
                />
                <View>
                  <Text
                    className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Your Name
                  </Text>
                  <Text
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    @yourusername
                  </Text>
                </View>
              </View>
            </View>

            {/* Navigation Links */}
            <ScrollView
              className={`p-4 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <TouchableOpacity
                className={`flex-row items-center gap-3 p-3 rounded-lg ${activeTab === "home" ? (theme === "dark" ? "bg-[#202024]" : "bg-gray-100") : ""}`}
                onPress={() => {
                  handleTabPress("home");
                  router.push("/");
                  toggleSidebar();
                }}
              >
                <View
                  className={`${activeTab === "home" ? "text-purple-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  <Home
                    size={20}
                    color={
                      activeTab === "home"
                        ? "#8b5cf6"
                        : theme === "dark"
                          ? "#9ca3af"
                          : "#6b7280"
                    }
                  />
                </View>
                <Text
                  className={`${activeTab === "home" ? "text-purple-500" : theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center gap-3 p-3 rounded-lg ${activeTab === "explore" ? (theme === "dark" ? "bg-[#202024]" : "bg-gray-100") : ""}`}
                onPress={() => {
                  handleTabPress("explore");
                  router.push("/explore");
                  toggleSidebar();
                }}
              >
                <View
                  className={`${activeTab === "explore" ? "text-purple-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  <Compass
                    size={20}
                    color={
                      activeTab === "explore"
                        ? "#8b5cf6"
                        : theme === "dark"
                          ? "#9ca3af"
                          : "#6b7280"
                    }
                  />
                </View>
                <Text
                  className={`${activeTab === "explore" ? "text-purple-500" : theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Explore
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center gap-3 p-3 rounded-lg ${activeTab === "chat" ? (theme === "dark" ? "bg-[#202024]" : "bg-gray-100") : ""}`}
                onPress={() => {
                  handleTabPress("chat");
                  router.push("/chat");
                  toggleSidebar();
                }}
              >
                <View
                  className={`${activeTab === "chat" ? "text-purple-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  <MessageSquare
                    size={20}
                    color={
                      activeTab === "chat"
                        ? "#8b5cf6"
                        : theme === "dark"
                          ? "#9ca3af"
                          : "#6b7280"
                    }
                  />
                </View>
                <Text
                  className={`${activeTab === "chat" ? "text-purple-500" : theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Private Chats
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center gap-3 p-3 rounded-lg`}
                onPress={() => {
                  router.push("/notifications");
                  toggleSidebar();
                }}
                activeOpacity={0.7}
              >
                <Bell
                  size={20}
                  color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                />
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Notifications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center gap-3 p-3 rounded-lg ${activeTab === "profile" ? (theme === "dark" ? "bg-[#202024]" : "bg-gray-100") : ""}`}
                onPress={() => {
                  handleTabPress("profile");
                  router.push("/profile");
                  toggleSidebar();
                }}
              >
                <View
                  className={`${activeTab === "profile" ? "text-purple-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  <User
                    size={20}
                    color={
                      activeTab === "profile"
                        ? "#8b5cf6"
                        : theme === "dark"
                          ? "#9ca3af"
                          : "#6b7280"
                    }
                  />
                </View>
                <Text
                  className={`${activeTab === "profile" ? "text-purple-500" : theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center gap-3 p-3 rounded-lg`}
                onPress={() => {
                  router.push("/settings");
                  toggleSidebar();
                }}
                activeOpacity={0.7}
              >
                <Settings
                  size={20}
                  color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                />
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Settings & Support
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Quick Actions */}
            <View
              className={`p-4 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
            >
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
              >
                Quick Actions
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-2 bg-purple-500 p-2.5 rounded-lg"
                  onPress={() => {
                    toggleSidebar();
                    setRecordModalVisible(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Mic size={16} color="#ffffff" />
                  <Text className="text-sm text-white">Record</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center gap-2 ${theme === "dark" ? "bg-[#202024]" : "bg-gray-100"} p-2.5 rounded-lg`}
                  onPress={() => {
                    toggleSidebar();
                    // Use React Native's Share API
                    const { Share } = require("react-native");
                    Share.share({
                      title: "WhisperWall",
                      message:
                        "Check out WhisperWall - a voice-based social sharing app!",
                      url: "https://whisperwall.app",
                    }).catch((error) => console.log("Error sharing:", error));
                  }}
                  activeOpacity={0.7}
                >
                  <Share
                    size={16}
                    color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  />
                  <Text
                    className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="p-4 mt-auto">
              <View className="flex-row flex-wrap gap-2 mb-4">
                <Text
                  className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  Terms
                </Text>
                <Text
                  className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  Privacy
                </Text>
                <Text
                  className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  Help
                </Text>
              </View>
              <TouchableOpacity
                className={`w-full flex-row items-center justify-center gap-2 ${theme === "dark" ? "bg-[#202024]" : "bg-gray-100"} p-2.5 rounded-lg`}
                onPress={async () => {
                  toggleSidebar();
                  try {
                    const { signOut } = await import("../src/services/auth");
                    const response = await signOut();
                    if (response.success) {
                      router.replace("/sign-in");
                    } else {
                      alert(`Logout failed: ${response.error}`);
                    }
                  } catch (error) {
                    console.error("Error during logout:", error);
                    alert("An error occurred during logout");
                  }
                }}
                activeOpacity={0.7}
              >
                <LogOut size={16} color="#ef4444" />
                <Text className="text-sm text-red-500">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Backdrop */}
          <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={toggleSidebar}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
