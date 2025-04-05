import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
} from "react-native";
import {
  User,
  Settings,
  ArrowLeft,
  MoreVertical,
  Camera,
  Globe,
  Lock,
  Ban,
  Bell,
  Key,
  Trash2,
  Home,
  Compass,
  MessageSquare,
  ChevronRight,
  X,
  Mic,
} from "lucide-react-native";
import BottomNavigation from "../components/BottomNavigation";
import { useTheme } from "../src/contexts/ThemeContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("profile");
  const [activeContentTab, setActiveContentTab] = useState("recordings");
  const { theme } = useTheme();
  const router = useRouter();

  // Mock user data
  const userData = {
    name: "Your Name",
    username: "@yourusername",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
    bio: "Sharing stories through voice 🎤",
    stats: {
      voices: 248,
      listeners: 1200,
      following: 891,
    },
    recordings: [
      {
        id: "rec1",
        title: "Today's Thoughts",
        time: "2m ago",
        duration: "1:23",
        progress: 33,
      },
      {
        id: "rec2",
        title: "Weekly Update",
        time: "2d ago",
        duration: "2:45",
        progress: 100,
      },
    ],
    followers: [
      {
        id: "u1",
        name: "Alex Thompson",
        username: "@alexthompson",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
      },
      {
        id: "u2",
        name: "Mike Johnson",
        username: "@mikejohnson",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      },
    ],
    following: [
      {
        id: "u3",
        name: "Jamie Rodriguez",
        username: "@jamierodriguez",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      },
      {
        id: "u4",
        name: "Alex Thompson",
        username: "@alexthompson",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
      },
      {
        id: "u5",
        name: "Taylor Swift",
        username: "@taylorswift",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      },
    ],
    blockedUsers: [
      {
        id: "u6",
        name: "John Doe",
        username: "@johndoe",
        date: "Blocked on Jan 15",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
      },
      {
        id: "u7",
        name: "Mike Smith",
        username: "@mikesmith",
        date: "Blocked on Jan 10",
        avatar:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg",
      },
    ],
  };

  // Handle navigation back
  const handleBack = () => {
    router.back();
  };

  // Handle profile picture update
  const handleUpdateProfilePicture = () => {
    // In a real app, this would open image picker
    alert("Profile picture update functionality would open here");
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeContentTab) {
      case "recordings":
        return (
          <View className="px-4 mb-6">
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
            >
              My Recordings
            </Text>
            <View className="space-y-3">
              {userData.recordings.map((recording) => (
                <TouchableOpacity
                  key={recording.id}
                  onPress={() => router.push(`/post/${recording.id}`)}
                >
                  <View
                    className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4`}
                    style={{
                      shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-2">
                        <View className="w-8 h-8 bg-purple-500/20 rounded-full items-center justify-center">
                          <Text className="text-purple-500">🎤</Text>
                        </View>
                        <Text
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                        >
                          {recording.title}
                        </Text>
                      </View>
                      <Text
                        className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {recording.time}
                      </Text>
                    </View>
                    <View
                      className={`${theme === "dark" ? "bg-[#2a2a2e]" : "bg-gray-100"} rounded-lg p-3`}
                    >
                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity className="text-purple-500">
                          <Text className="text-purple-500">▶️</Text>
                        </TouchableOpacity>
                        <View className="flex-1 h-1 bg-[#111112] rounded-full">
                          <View
                            className={`h-full bg-purple-500 rounded-full`}
                            style={{ width: `${recording.progress}%` }}
                          />
                        </View>
                        <Text
                          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {recording.duration}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "followers":
        return (
          <View className="px-4 mb-6">
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
            >
              Followers
            </Text>
            <View className="space-y-3">
              {userData.followers.map((follower) => (
                <TouchableOpacity
                  key={follower.id}
                  onPress={() => router.push(`/profile/${follower.id}`)}
                  className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4`}
                  style={{
                    shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <Image
                        source={{ uri: follower.avatar }}
                        className="w-10 h-10 rounded-full"
                      />
                      <View>
                        <Text
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                        >
                          {follower.name}
                        </Text>
                        <Text
                          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {follower.username}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className={`text-sm ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
                    >
                      View
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "following":
        return (
          <View className="px-4 mb-6">
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
            >
              Following
            </Text>
            <View className="space-y-3">
              {userData.following.map((following) => (
                <TouchableOpacity
                  key={following.id}
                  onPress={() => router.push(`/profile/${following.id}`)}
                  className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4`}
                  style={{
                    shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <Image
                        source={{ uri: following.avatar }}
                        className="w-10 h-10 rounded-full"
                      />
                      <View>
                        <Text
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                        >
                          {following.name}
                        </Text>
                        <Text
                          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {following.username}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className={`text-sm ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
                    >
                      View
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "blocked":
        return (
          <View className="px-4 mb-8">
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-3`}
            >
              Blocked Users
            </Text>
            <View
              className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl divide-y ${theme === "dark" ? "divide-gray-800" : "divide-gray-200"}`}
              style={{
                shadowColor: theme === "dark" ? "#8b5cf6" : "#a78bfa",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              {userData.blockedUsers.map((user) => (
                <View
                  key={user.id}
                  className="p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={{ uri: user.avatar }}
                      className="w-10 h-10 rounded-full"
                    />
                    <View>
                      <Text
                        className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
                      >
                        {user.name}
                      </Text>
                      <Text
                        className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {user.date}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-purple-500 text-sm">Unblock</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
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

      {/* Settings button moved to top-right corner */}
      <View className="absolute top-0 right-0 z-10 p-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/settings")}
        >
          <Settings
            size={20}
            color={theme === "dark" ? "#9ca3af" : "#6b7280"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        className={`flex-1 pb-20 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="px-4 pt-4 items-center">
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
            className={`text-xl font-semibold mt-4 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            {userData.name}
          </Text>
          <Text
            className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm mt-1`}
          >
            {userData.bio.replace(" 🎤", "")}
          </Text>

          {/* Profile Stats */}
          <View className="flex-row justify-between w-full mt-4 px-6">
            <TouchableOpacity
              onPress={() => setActiveContentTab("recordings")}
              className="items-center"
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"} font-bold text-lg`}
              >
                {userData.stats.voices}
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm`}
              >
                Recordings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveContentTab("followers")}
              className="items-center"
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"} font-bold text-lg`}
              >
                {userData.stats.listeners > 999
                  ? `${(userData.stats.listeners / 1000).toFixed(1)}k`
                  : userData.stats.listeners}
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm`}
              >
                Followers
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveContentTab("following")}
              className="items-center"
            >
              <Text
                className={`${theme === "dark" ? "text-white" : "text-[#111827]"} font-bold text-lg`}
              >
                {userData.stats.following}
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm`}
              >
                Following
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View
          className={`flex-row px-4 pt-6 pb-4 justify-center ${theme === "dark" ? "bg-[#111112]" : "bg-[#f9fafb]"}`}
        >
          <TouchableOpacity
            className={`mr-4 pb-2 ${activeContentTab === "recordings" ? "border-b-2 border-purple-500" : ""}`}
            onPress={() => setActiveContentTab("recordings")}
          >
            <Text
              className={`${activeContentTab === "recordings" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium`}
            >
              Recordings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-4 pb-2 ${activeContentTab === "followers" ? "border-b-2 border-purple-500" : ""}`}
            onPress={() => setActiveContentTab("followers")}
          >
            <Text
              className={`${activeContentTab === "followers" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium`}
            >
              Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-4 pb-2 ${activeContentTab === "following" ? "border-b-2 border-purple-500" : ""}`}
            onPress={() => setActiveContentTab("following")}
          >
            <Text
              className={`${activeContentTab === "following" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium`}
            >
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`pb-2 ${activeContentTab === "blocked" ? "border-b-2 border-purple-500" : ""}`}
            onPress={() => setActiveContentTab("blocked")}
          >
            <Text
              className={`${activeContentTab === "blocked" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium`}
            >
              Blocked
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={(tab) => setActiveTab(tab)}
      />
    </SafeAreaView>
  );
}
