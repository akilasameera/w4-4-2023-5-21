import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../src/contexts/ThemeContext";

interface MoodFilterProps {
  selectedMood?: string;
  onSelectMood?: (mood: string) => void;
  moods?: string[];
}

const MoodFilter = ({
  selectedMood = "All",
  onSelectMood = () => {},
  moods = [
    "All",
    "Happy",
    "Sad",
    "Excited",
    "Stressed",
    "Anxious",
    "Calm",
    "Confused",
  ],
}: MoodFilterProps) => {
  const { theme } = useTheme();
  return (
    <View
      className={`w-full ${theme === "dark" ? "bg-[#111112]/90" : "bg-[#f9fafb]/90"} backdrop-blur-lg z-40 px-4 py-3`}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex flex-row gap-2"
      >
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood}
            onPress={() => onSelectMood(mood)}
            className={`px-4 py-1.5 rounded-full ${selectedMood === mood ? "bg-purple-500" : theme === "dark" ? "bg-[#202024]" : "bg-[#e5e7eb]"}`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm ${selectedMood === mood ? "text-white" : theme === "dark" ? "text-white" : "text-[#111827]"} whitespace-nowrap`}
            >
              {mood}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MoodFilter;
