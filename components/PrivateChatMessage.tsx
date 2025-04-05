import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useTheme } from "../src/contexts/ThemeContext";

interface PrivateChatMessageProps {
  id?: string;
  sender?: "me" | "other";
  text?: string;
  time?: string;
  isVoice?: boolean;
  duration?: string;
  progress?: number;
  read?: boolean;
  userAvatar?: string;
  onPlay?: () => void;
}

const PrivateChatMessage: React.FC<PrivateChatMessageProps> = ({
  id = "1",
  sender = "other",
  text = "Hello there!",
  time = "10:30 AM",
  isVoice = false,
  duration = "0:42",
  progress = 0.33,
  read = false,
  userAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  onPlay = () => {
    console.log("Playing voice message");
  },
}) => {
  const isOwnMessage = sender === "me";

  const { theme } = useTheme ? useTheme() : { theme: "dark" };
  const isLightTheme = theme === "light";

  if (isVoice) {
    return (
      <View
        className={`flex ${isOwnMessage ? "flex-row-reverse" : "flex-row"} gap-2 mb-4`}
      >
        {!isOwnMessage && (
          <Image
            source={{ uri: userAvatar }}
            className="w-8 h-8 rounded-full self-end"
          />
        )}
        <View className="max-w-[75%]">
          <View className={`bg-purple-500 rounded-2xl p-3 mb-1`}>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center"
                onPress={onPlay}
              >
                <Text className="text-white text-sm">▶</Text>
              </TouchableOpacity>
              <View
                className={`flex-1 h-1 ${isLightTheme ? "bg-gray-200" : "bg-[#3a3a3e]"} rounded-full`}
              >
                <View
                  style={{ width: `${progress * 100}%` }}
                  className="h-full bg-purple-500 rounded-full"
                />
              </View>
              <Text
                className={`text-xs ${isLightTheme ? "text-gray-500" : "text-gray-400"}`}
              >
                {duration}
              </Text>
            </View>
          </View>
          <View
            className={`flex ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
          >
            <Text
              className={`text-xs ${isLightTheme ? "text-gray-500" : "text-gray-400"}`}
            >
              {time}
            </Text>
            {isOwnMessage && read && (
              <Text className="text-xs text-blue-400 ml-1">✓✓</Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      className={`flex ${isOwnMessage ? "flex-row-reverse" : "flex-row"} gap-2 mb-4`}
    >
      {!isOwnMessage && (
        <Image
          source={{ uri: userAvatar }}
          className="w-8 h-8 rounded-full self-end"
        />
      )}
      <View className="max-w-[75%]">
        <View className={`bg-purple-500 rounded-2xl p-3 mb-1`}>
          <Text className="text-sm text-white">{text}</Text>
        </View>
        <View
          className={`flex ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
        >
          <Text
            className={`text-xs ${isLightTheme ? "text-gray-500" : "text-gray-400"}`}
          >
            {time}
          </Text>
          {isOwnMessage && read && (
            <Text className="text-xs text-blue-400 ml-1">✓✓</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default PrivateChatMessage;
