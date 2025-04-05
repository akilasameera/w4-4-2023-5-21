import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react-native";
import VoiceCard from "../components/VoiceCard";

export default function PostDetailsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  // Mock data for voice messages - in a real app, this would come from an API
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
      content: "Just finished my first marathon! Can't believe I did it!",
    },
    {
      id: "2",
      user: {
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        timeAgo: "5 hours ago",
        language: "Mandarin",
      },
      mood: "Calm",
      moodColor: "#3b82f6",
      audioDuration: "2:45",
      progress: 0.66,
      likes: 42,
      comments: 15,
      content:
        "Sharing my thoughts on mindfulness and daily meditation practice.",
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
      content:
        "My trip to Barcelona was amazing! The architecture is breathtaking.",
    },
  ];

  // Mock comments data
  const mockComments = [
    {
      id: "c1",
      user: {
        name: "Jamie Lee",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      },
      text: "This is so inspiring! Congrats on finishing the marathon!",
      timeAgo: "1 hour ago",
    },
    {
      id: "c2",
      user: {
        name: "David Kim",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      },
      text: "Amazing achievement! How long did you train for?",
      timeAgo: "45 minutes ago",
    },
    {
      id: "c3",
      user: {
        name: "Sophia Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
      },
      text: "You're such an inspiration! I'm training for my first 5K.",
      timeAgo: "20 minutes ago",
    },
  ];

  useEffect(() => {
    // Find the post with the matching ID
    const foundPost = voiceMessages.find((msg) => msg.id === postId);
    if (foundPost) {
      setPost(foundPost);
      // Load comments for this post
      setComments(mockComments);
    }
  }, [postId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-[#111112] items-center justify-center">
        <Text className="text-white">Loading post...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#111112]">
      <StatusBar barStyle="light-content" backgroundColor="#111112" />

      {/* Header */}
      <View className="bg-[#111112]/90 px-4 py-3 border-b border-gray-800">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#e5e7eb" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">Voice Post</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-2 pb-20">
        {/* Voice Card */}
        <VoiceCard
          username={post.user.name}
          userAvatar={post.user.avatar}
          timeAgo={post.user.timeAgo}
          language={post.user.language}
          mood={post.mood}
          moodColor={post.moodColor}
          duration={post.audioDuration}
          progress={post.progress}
          likes={post.likes}
          comments={post.comments}
          isPlaying={isPlaying}
          onPlay={handlePlayPause}
          onLike={() => console.log("Like post")}
          onComment={() => console.log("Comment on post")}
          onShare={() => console.log("Share post")}
        />

        {/* Post Content Preview */}
        <View className="bg-[#202024] rounded-xl p-4 mb-4">
          <Text className="text-gray-300">{post.content}</Text>
        </View>

        {/* Comments Section */}
        <View className="mb-4">
          <Text className="text-white text-lg font-semibold mb-3">
            Comments ({comments.length})
          </Text>

          {comments.map((comment) => (
            <View key={comment.id} className="bg-[#202024] rounded-xl p-4 mb-3">
              <View className="flex-row items-center gap-3 mb-2">
                <Image
                  source={{ uri: comment.user.avatar }}
                  className="w-8 h-8 rounded-full"
                />
                <View>
                  <Text className="font-medium text-white">
                    {comment.user.name}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {comment.timeAgo}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-300">{comment.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
