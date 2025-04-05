import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Heart, MessageCircle, Share2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../src/contexts/ThemeContext";
import { getLanguageFlag } from "../src/utils/languageFlags";
import { getCountryFlag } from "../src/utils/countryFlags";

interface VoiceCardProps {
  id?: string;
  username?: string;
  userAvatar?: string;
  timeAgo?: string;
  language?: string;
  country?: string;
  mood?: string;
  moodColor?: string;
  duration?: string;
  progress?: number;
  likes?: number;
  comments?: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  disableNavigation?: boolean;
}

const VoiceCard: React.FC<VoiceCardProps> = ({
  id = "1",
  username = "Alex Thompson",
  userAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
  timeAgo = "2 hours ago",
  language = "English",
  country = "United States",
  mood = "Excited",
  moodColor = "#8b5cf6",
  duration = "1:24",
  progress = 0.33,
  likes = 24,
  comments = 8,
  isPlaying = false,
  onPlay = () => {},
  onLike = () => {},
  onComment = () => {},
  onShare = () => {
    try {
      // Use React Native's Share API instead of web navigator.share
      const { Share } = require("react-native");
      Share.share({
        title: "Voice Message",
        message: `Check out this voice message from ${username}`,
        url: `https://whisperwall.app/post/${id}`,
      }).catch((error) => console.log("Error sharing:", error));
    } catch (error) {
      console.log("Error sharing:", error);
    }
  },

  disableNavigation = false,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleCardPress = () => {
    if (!disableNavigation) {
      router.push(`/post/${id}`);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={disableNavigation ? 1 : 0.7}
      onPress={handleCardPress}
      className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4 mb-4 shadow-lg`}
    >
      <View>
        {/* User Info and Mood Tag */}
        <View className="flex-row items-center gap-3 mb-3">
          <TouchableOpacity
            onPress={() => {
              if (!disableNavigation) {
                router.push({
                  pathname: `/private-chat/${id}`,
                  params: { username, userAvatar },
                });
              }
            }}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: userAvatar }}
              className="w-10 h-10 rounded-full"
            />
          </TouchableOpacity>
          <View className="flex-1">
            <Text
              className={`font-medium ${theme === "dark" ? "text-white" : "text-[#111827]"}`}
            >
              {username}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text
                className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                {timeAgo}
              </Text>
              <Text
                className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                •
              </Text>
              {language && (
                <View className="flex-row items-center gap-1">
                  <Text
                    className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {getLanguageFlag(language)} {language}{" "}
                    {getCountryFlag(country)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={{ backgroundColor: `${moodColor}20` }}
            className="px-2 py-1 rounded-full"
          >
            <Text style={{ color: moodColor }} className="text-xs">
              {mood}
            </Text>
          </View>
        </View>

        {/* Audio Player */}
        <View
          className={`${theme === "dark" ? "bg-[#2a2a2e]" : "bg-[#f3f4f6]"} rounded-lg p-3`}
        >
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={onPlay}
              className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center"
            >
              {isPlaying ? (
                <Text className="text-white text-sm">II</Text>
              ) : (
                <Text className="text-white text-sm">▶</Text>
              )}
            </TouchableOpacity>
            <View
              className={`flex-1 h-1 ${theme === "dark" ? "bg-[#3a3a3e]" : "bg-[#d1d5db]"} rounded-full`}
            >
              <View
                style={{ width: `${progress * 100}%` }}
                className="h-full bg-purple-500 rounded-full"
              />
            </View>
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {duration}
            </Text>
          </View>
        </View>

        {/* Interaction Buttons */}
        <View className="flex-row items-center gap-4 mt-3">
          <TouchableOpacity
            onPress={onLike}
            className="flex-row items-center gap-2"
          >
            <Heart size={18} color="#9ca3af" />
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onComment}
            className="flex-row items-center gap-2"
          >
            <MessageCircle size={18} color="#9ca3af" />
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {comments}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onShare}
            className="flex-row items-center gap-2 ml-auto"
          >
            <Share2 size={18} color="#9ca3af" />
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VoiceCard;
