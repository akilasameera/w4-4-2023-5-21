import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  Heart,
  MessageSquare,
  Filter,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import BottomNavigation from "../components/BottomNavigation";
import { useTheme } from "../src/contexts/ThemeContext";

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();
  const { colors, theme } = useTheme();

  // Mock notification data
  const notifications = [
    {
      id: "1",
      type: "comment",
      isUnread: true,
      user: {
        name: "Alex Thompson",
        avatar:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
      },
      content:
        'Commented on your voice message: "Thank you for sharing your story..."',
      timeAgo: "2m ago",
      action: "View comment",
      icon: "comment",
    },
    {
      id: "2",
      type: "like",
      isUnread: false,
      user: {
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      },
      content: "Liked your voice message",
      timeAgo: "1h ago",
      action: "View post",
      icon: "heart",
    },
    {
      id: "3",
      type: "chat",
      isUnread: true,
      user: {
        name: "Michael Ross",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      },
      content: "Sent you a chat request",
      timeAgo: "3h ago",
      action: "chat_request",
      icon: "message",
    },
    {
      id: "4",
      type: "system",
      isUnread: false,
      user: {
        name: "System Update",
        avatar: null,
      },
      content: "New features available! Check out the latest voice filters.",
      timeAgo: "1d ago",
      action: null,
      icon: "bell",
    },
  ];

  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter(
          (notification) => notification.type === activeFilter,
        );

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View
        style={{
          backgroundColor: colors.headerBg,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text }}>
            Notifications
          </Text>
        </View>
      </View>

      {/* Notification Filters */}
      <View
        style={{
          backgroundColor: colors.headerBg,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row", gap: 8 }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 9999,
                backgroundColor:
                  activeFilter === "all" ? colors.primary : colors.cardAlt,
                marginRight: 8,
              }}
              onPress={() => setActiveFilter("all")}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: activeFilter === "all" ? "white" : colors.text,
                }}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 9999,
                backgroundColor:
                  activeFilter === "comment" ? colors.primary : colors.cardAlt,
                marginRight: 8,
              }}
              onPress={() => setActiveFilter("comment")}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: activeFilter === "comment" ? "white" : colors.text,
                }}
              >
                Comments
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 9999,
                backgroundColor:
                  activeFilter === "like" ? colors.primary : colors.cardAlt,
                marginRight: 8,
              }}
              onPress={() => setActiveFilter("like")}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: activeFilter === "like" ? "white" : colors.text,
                }}
              >
                Likes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 9999,
                backgroundColor:
                  activeFilter === "chat" ? colors.primary : colors.cardAlt,
                marginRight: 8,
              }}
              onPress={() => setActiveFilter("chat")}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: activeFilter === "chat" ? "white" : colors.text,
                }}
              >
                Chats
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            activeOpacity={0.7}
          >
            <Filter size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              Newest
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.map((notification) => (
          <View
            key={notification.id}
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              shadowColor: theme === "dark" ? "#000" : "#888",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
              borderLeftWidth: notification.isUnread ? 4 : 0,
              borderLeftColor: notification.isUnread
                ? colors.primary
                : "transparent",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              {notification.type === "system" ? (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${colors.primary}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bell size={18} color={colors.primary} />
                </View>
              ) : (
                <Image
                  source={{ uri: notification.user.avatar }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              )}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontWeight: "500", color: colors.text }}>
                    {notification.user.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {notification.timeAgo}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                  {notification.content}
                </Text>

                {notification.action === "chat_request" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 12,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        backgroundColor: colors.primary,
                        borderRadius: 9999,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 14, color: "white" }}>
                        Accept
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        backgroundColor: colors.cardAlt,
                        borderRadius: 9999,
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 14, color: colors.text }}>
                        Decline
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : notification.action ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 8,
                    }}
                    activeOpacity={0.7}
                  >
                    {notification.icon === "comment" && (
                      <MessageSquare size={14} color={colors.primary} />
                    )}
                    {notification.icon === "heart" && (
                      <Heart size={14} color="#ef4444" />
                    )}
                    {notification.icon === "message" && (
                      <MessageSquare size={14} color={colors.primary} />
                    )}
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      {notification.action}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}
