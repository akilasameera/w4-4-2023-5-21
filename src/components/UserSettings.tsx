import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Mic,
  Users,
  UserPlus,
  Ban,
  ChevronRight,
} from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import auth from "../services/auth";

const UserSettings = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("recordings");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in a real app, this would be fetched from the backend
  const userData = {
    recordings: [
      {
        id: "r1",
        title: "Morning thoughts",
        duration: "1:24",
        date: "2 days ago",
        likes: 42,
        comments: 8,
      },
      {
        id: "r2",
        title: "Weekend reflections",
        duration: "2:15",
        date: "5 days ago",
        likes: 78,
        comments: 12,
      },
      {
        id: "r3",
        title: "Project ideas",
        duration: "3:40",
        date: "1 week ago",
        likes: 103,
        comments: 24,
      },
    ],
    followers: [
      {
        id: "u1",
        name: "Sarah Chen",
        username: "@sarahchen",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
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
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      },
    ],
  };

  // In a real app, this would fetch data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Here you would fetch the actual data from your backend
        // const user = await auth.getCurrentUser();
        // const userData = await fetchUserDataFromBackend(user.id);

        // For now, we're using mock data
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-10">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text
            className={`mt-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading...
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case "recordings":
        return (
          <View className="py-4">
            <Text
              className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              My Recordings
            </Text>
            {userData.recordings.length > 0 ? (
              userData.recordings.map((recording) => (
                <TouchableOpacity
                  key={recording.id}
                  className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4 mb-3 shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
                  onPress={() => router.push(`/post/${recording.id}`)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                        <Mic size={18} color="#8b5cf6" />
                      </View>
                      <View>
                        <Text
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {recording.title}
                        </Text>
                        <Text
                          className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {recording.duration} • {recording.date}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <Text
                        className={`mr-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {recording.likes} likes • {recording.comments} comments
                      </Text>
                      <ChevronRight
                        size={16}
                        color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View
                className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-6 items-center shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
              >
                <Text
                  className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  You haven't created any recordings yet.
                </Text>
                <TouchableOpacity
                  className="mt-4 bg-purple-600 px-4 py-2 rounded-full"
                  onPress={() => router.push("/")}
                >
                  <Text className="text-white font-medium">
                    Create Your First Voice
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case "followers":
        return (
          <View className="py-4">
            <Text
              className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Followers
            </Text>
            {userData.followers.length > 0 ? (
              userData.followers.map((follower) => (
                <TouchableOpacity
                  key={follower.id}
                  className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4 mb-3 shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
                  onPress={() => router.push(`/profile/${follower.id}`)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: follower.avatar }}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <View>
                        <Text
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {follower.name}
                        </Text>
                        <Text
                          className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {follower.username}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight
                      size={16}
                      color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View
                className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-6 items-center shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
              >
                <Text
                  className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  You don't have any followers yet.
                </Text>
              </View>
            )}
          </View>
        );

      case "following":
        return (
          <View className="py-4">
            <Text
              className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Following
            </Text>
            {userData.following.length > 0 ? (
              userData.following.map((following) => (
                <TouchableOpacity
                  key={following.id}
                  className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4 mb-3 shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
                  onPress={() => router.push(`/profile/${following.id}`)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: following.avatar }}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <View>
                        <Text
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {following.name}
                        </Text>
                        <Text
                          className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {following.username}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight
                      size={16}
                      color={theme === "dark" ? "#9ca3af" : "#6b7280"}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View
                className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-6 items-center shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
              >
                <Text
                  className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  You are not following anyone yet.
                </Text>
              </View>
            )}
          </View>
        );

      case "blocked":
        return (
          <View className="py-4">
            <Text
              className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Blocked Users
            </Text>
            {userData.blockedUsers.length > 0 ? (
              userData.blockedUsers.map((blockedUser) => (
                <TouchableOpacity
                  key={blockedUser.id}
                  className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4 mb-3 shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: blockedUser.avatar }}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <View>
                        <Text
                          className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {blockedUser.name}
                        </Text>
                        <Text
                          className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {blockedUser.username}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="bg-purple-600 px-3 py-1.5 rounded-full"
                      onPress={() => {
                        // In a real app, this would unblock the user
                        Alert.alert(
                          "Unblock User",
                          `Are you sure you want to unblock ${blockedUser.name}?`,
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Unblock",
                              onPress: () => {
                                // In a real app, this would call an API to unblock the user
                                Alert.alert(
                                  `${blockedUser.name} has been unblocked`,
                                );
                              },
                            },
                          ],
                        );
                      }}
                    >
                      <Text className="text-white text-xs font-medium">
                        Unblock
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View
                className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-6 items-center shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
              >
                <Text
                  className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  You haven't blocked any users.
                </Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-[#f9fafb]"}`}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#f9fafb"}
      />

      {/* Header */}
      <View
        className={`${theme === "dark" ? "bg-[#111112]/90 border-gray-800" : "bg-[#f9fafb]/90 border-gray-200"} px-4 py-3 border-b`}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft
              size={24}
              color={theme === "dark" ? "#e5e7eb" : "#374151"}
            />
          </TouchableOpacity>
          <Text
            className={`text-lg font-semibold ml-3 ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
          >
            User Activity
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View
        className={`flex-row px-4 pt-4 pb-2 ${theme === "dark" ? "bg-[#111112]" : "bg-[#f9fafb]"}`}
      >
        <TouchableOpacity
          className={`mr-4 pb-2 ${activeTab === "recordings" ? "border-b-2 border-purple-500" : ""}`}
          onPress={() => setActiveTab("recordings")}
        >
          <Text
            className={`${activeTab === "recordings" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium`}
          >
            Recordings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`mr-4 pb-2 ${activeTab === "followers" ? "border-b-2 border-purple-500" : ""}`}
          onPress={() => setActiveTab("followers")}
        >
          <Text
            className={`${activeTab === "followers" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium`}
          >
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`mr-4 pb-2 ${activeTab === "following" ? "border-b-2 border-purple-500" : ""}`}
          onPress={() => setActiveTab("following")}
        >
          <Text
            className={`${activeTab === "following" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium`}
          >
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`pb-2 ${activeTab === "blocked" ? "border-b-2 border-purple-500" : ""}`}
          onPress={() => setActiveTab("blocked")}
        >
          <Text
            className={`${activeTab === "blocked" ? (theme === "dark" ? "text-white" : "text-gray-900") : theme === "dark" ? "text-gray-400" : "text-gray-500"} font-medium`}
          >
            Blocked
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className={`flex-1 px-4 ${theme === "dark" ? "" : "bg-[#f9fafb]"}`}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserSettings;
