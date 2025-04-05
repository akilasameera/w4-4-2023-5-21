import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Volume2, Pause, Play } from "lucide-react-native";
import { useTheme } from "../src/contexts/ThemeContext";

interface AudioPlayerProps {
  duration?: string;
  progress?: number;
  volume?: number;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onVolumeChange?: (volume: number) => void;
}

const AudioPlayer = ({
  duration = "1:24",
  progress = 0.33,
  volume = 0.75,
  isPlaying = false,
  onPlayPause = () => console.log("Play/pause toggled"),
  onVolumeChange = () => console.log("Volume changed"),
}: AudioPlayerProps) => {
  const { theme } = useTheme();

  return (
    <View
      className={`${theme === "dark" ? "bg-[#2a2a2e]" : "bg-gray-100"} rounded-lg p-4 mb-4`}
    >
      <View className="flex-row items-center gap-4 mb-4">
        <TouchableOpacity
          onPress={onPlayPause}
          className="w-12 h-12 bg-purple-500 rounded-full items-center justify-center"
          activeOpacity={0.7}
        >
          {isPlaying ? (
            <Pause size={20} color="#ffffff" />
          ) : (
            <Play size={20} color="#ffffff" fill="#ffffff" />
          )}
        </TouchableOpacity>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-2">
            <View
              className={`flex-1 h-1 ${theme === "dark" ? "bg-[#3a3a3e]" : "bg-gray-200"} rounded-full`}
            >
              <View
                style={{ width: `${progress * 100}%` }}
                className="h-full bg-purple-500 rounded-full"
              />
            </View>
            <Text
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {duration}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Volume2
              size={14}
              color={theme === "dark" ? "#9ca3af" : "#6b7280"}
            />
            <View
              className={`flex-1 h-1 ${theme === "dark" ? "bg-[#3a3a3e]" : "bg-gray-200"} rounded-full`}
            >
              <View
                style={{ width: `${volume * 100}%` }}
                className={`h-full ${theme === "dark" ? "bg-gray-400" : "bg-gray-500"} rounded-full`}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;
