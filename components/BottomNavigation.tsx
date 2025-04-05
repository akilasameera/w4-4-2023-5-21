import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Compass, MessageSquare, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../src/contexts/ThemeContext";

interface BottomNavigationProps {
  activeTab?: "home" | "explore" | "chat" | "profile";
  onTabPress?: (tab: "home" | "explore" | "chat" | "profile") => void;
}

const BottomNavigation = ({
  activeTab = "home",
  onTabPress = () => {},
}: BottomNavigationProps) => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleTabPress = (tab: "home" | "explore" | "chat" | "profile") => {
    onTabPress(tab);

    // Navigate to the corresponding route
    switch (tab) {
      case "home":
        router.push("/");
        break;
      case "explore":
        router.push("/explore");
        break;
      case "chat":
        router.push("/chat");
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme === "dark" ? "#111112" : "#f9fafb",
          borderTopColor: theme === "dark" ? "#1f2937" : "#e5e7eb",
        },
      ]}
    >
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress("home")}
        activeOpacity={0.7}
      >
        <Home size={24} color={activeTab === "home" ? "#8b5cf6" : "#6b7280"} />
        <Text
          style={[styles.tabText, activeTab === "home" && styles.activeTabText]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress("explore")}
        activeOpacity={0.7}
      >
        <Compass
          size={24}
          color={activeTab === "explore" ? "#8b5cf6" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "explore" && styles.activeTabText,
          ]}
        >
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress("chat")}
        activeOpacity={0.7}
      >
        <MessageSquare
          size={24}
          color={activeTab === "chat" ? "#8b5cf6" : "#6b7280"}
        />
        <Text
          style={[styles.tabText, activeTab === "chat" && styles.activeTabText]}
        >
          Chat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress("profile")}
        activeOpacity={0.7}
      >
        <User
          size={24}
          color={activeTab === "profile" ? "#8b5cf6" : "#6b7280"}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "profile" && styles.activeTabText,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#6b7280",
  },
  activeTabText: {
    color: "#8b5cf6",
  },
});

export default BottomNavigation;
