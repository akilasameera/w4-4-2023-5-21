import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import {
  Heart,
  MessageCircle,
  Share2,
  Flag,
  MoreVertical,
  Send,
  Mic,
  StopCircle,
  X,
} from "lucide-react-native";
import { router } from "expo-router";
import AudioPlayer from "./AudioPlayer";
import CommentItem from "./CommentItem";
import { useTheme } from "../src/contexts/ThemeContext";

interface MentionUser {
  id: string;
  name: string;
  avatar: string;
}

interface CommentData {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  timeAgo: string;
  text: string;
  likes: number;
  replies?: CommentData[];
  mentions?: Array<{
    id: string;
    name: string;
    startIndex: number;
    endIndex: number;
  }>;
  isVoiceComment?: boolean;
  voiceDuration?: string;
}

interface VoiceDetailCardProps {
  id?: string;
  username?: string;
  userAvatar?: string;
  timestamp?: string;
  mood?: string;
  moodColor?: string;
  audioDuration?: string;
  progress?: number;
  volume?: number;
  likes?: number;
  comments?: number;
  commentsList?: CommentData[];
  allUsers?: MentionUser[];
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onMore?: () => void;
}

const VoiceDetailCard: React.FC<VoiceDetailCardProps> = ({
  id = "1",
  username = "Alex Thompson",
  userAvatar = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
  timestamp = "March 15, 2025 • 2:30 PM",
  mood = "Excited",
  moodColor = "#8b5cf6",
  audioDuration = "1:24",
  progress = 0.33,
  volume = 0.75,
  likes = 248,
  commentCount = 42,
  commentsList = [
    {
      id: "c1",
      user: {
        id: "u1",
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      },
      timeAgo: "1h ago",
      text: "This is exactly what I needed to hear today. Thank you for sharing! 💜",
      likes: 12,
      replies: [
        {
          id: "c1r1",
          user: {
            id: "u2",
            name: "Mike Johnson",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
          },
          timeAgo: "45m ago",
          text: "I agree with @Sarah Chen, this was really insightful!",
          likes: 3,
          mentions: [
            { id: "u1", name: "Sarah Chen", startIndex: 13, endIndex: 24 },
          ],
        },
      ],
    },
    {
      id: "c2",
      user: {
        id: "u2",
        name: "Mike Johnson",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      },
      timeAgo: "2h ago",
      text: "I can totally relate to this. Keep staying strong! 🙌",
      likes: 8,
      isVoiceComment: true,
      voiceDuration: "0:22",
    },
  ],
  allUsers = [
    {
      id: "u1",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    {
      id: "u2",
      name: "Mike Johnson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    {
      id: "u3",
      name: "Jamie Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    {
      id: "u4",
      name: "Alex Thompson",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
    },
  ],
  onLike = () => console.log("Like post"),
  onComment = () => console.log("Comment on post"),
  onShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Voice Message",
          text: `Check out this voice message from ${username}`,
          url: `https://whisperwall.app/post/${id}`,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      console.log("Share post");
    }
  },

  onReport = () => console.log("Report post"),
  onMore = () => console.log("More options"),
}) => {
  const { theme, colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentData[]>(commentsList);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [commentMentions, setCommentMentions] = useState<
    Array<{ id: string; name: string; startIndex: number; endIndex: number }>
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [replyingToComment, setReplyingToComment] = useState<string | null>(
    null,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTextChange = (newText: string) => {
    setComment(newText);

    // Check for @ symbol to trigger mention suggestions
    const lastAtSymbolIndex = newText.lastIndexOf("@");
    if (
      lastAtSymbolIndex !== -1 &&
      (lastAtSymbolIndex === 0 || newText[lastAtSymbolIndex - 1] === " ")
    ) {
      setMentionStartIndex(lastAtSymbolIndex);
      const searchText = newText.substring(lastAtSymbolIndex + 1);
      setMentionSearch(searchText);
      setShowMentions(true);
    } else if (showMentions) {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (user: MentionUser) => {
    const beforeMention = comment.substring(0, mentionStartIndex);
    const afterMention = comment.substring(
      mentionStartIndex + mentionSearch.length + 1,
    );
    const newText = `${beforeMention}@${user.name} ${afterMention}`;

    // Add to mentions array
    const newMention = {
      id: user.id,
      name: user.name,
      startIndex: mentionStartIndex,
      endIndex: mentionStartIndex + user.name.length + 1, // +1 for the @ symbol
    };

    setCommentMentions([...commentMentions, newMention]);
    setComment(newText);
    setShowMentions(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    setShowVoiceModal(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        // Max 30 seconds
        if (prev >= 30) {
          stopRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    stopRecording();
    setShowVoiceModal(false);
    setReplyingToComment(null);
  };

  const saveVoiceComment = () => {
    stopRecording();

    // Format duration as MM:SS
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    const formattedDuration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (replyingToComment) {
      // Add voice reply to a specific comment
      addReplyToComment(replyingToComment, "", [], true, formattedDuration);
    } else {
      // Add top-level voice comment
      const newComment: CommentData = {
        id: `c${comments.length + 1}`,
        user: {
          id: "u4", // Current user
          name: "You",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
        },
        timeAgo: "Just now",
        text: "",
        likes: 0,
        isVoiceComment: true,
        voiceDuration: formattedDuration,
      };

      setComments([newComment, ...comments]);
    }

    setShowVoiceModal(false);
    setReplyingToComment(null);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      const newComment: CommentData = {
        id: `c${comments.length + 1}`,
        user: {
          id: "u4", // Current user
          name: "You",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
        },
        timeAgo: "Just now",
        text: comment,
        likes: 0,
        mentions: commentMentions.length > 0 ? commentMentions : undefined,
      };

      setComments([newComment, ...comments]);
      setComment("");
      setCommentMentions([]);
    }
  };

  const addReplyToComment = (
    commentId: string,
    replyText: string,
    mentions: Array<{
      id: string;
      name: string;
      startIndex: number;
      endIndex: number;
    }>,
    isVoice = false,
    voiceDuration = "0:00",
  ) => {
    // Create a deep copy of the comments array
    const updatedComments = JSON.parse(JSON.stringify(comments));

    // Helper function to find and update a comment in the nested structure
    const findAndAddReply = (
      commentsArray: CommentData[],
      targetId: string,
    ): boolean => {
      for (let i = 0; i < commentsArray.length; i++) {
        if (commentsArray[i].id === targetId) {
          // Found the target comment, add reply
          if (!commentsArray[i].replies) {
            commentsArray[i].replies = [];
          }

          const newReply: CommentData = {
            id: `${targetId}r${commentsArray[i].replies.length + 1}`,
            user: {
              id: "u4", // Current user
              name: "You",
              avatar:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
            },
            timeAgo: "Just now",
            text: replyText,
            likes: 0,
            mentions: mentions.length > 0 ? mentions : undefined,
            isVoiceComment: isVoice,
            voiceDuration: isVoice ? voiceDuration : undefined,
          };

          commentsArray[i].replies.unshift(newReply);
          return true;
        }

        // Check in replies recursively
        if (commentsArray[i].replies && commentsArray[i].replies.length > 0) {
          if (findAndAddReply(commentsArray[i].replies, targetId)) {
            return true;
          }
        }
      }

      return false;
    };

    findAndAddReply(updatedComments, commentId);
    setComments(updatedComments);
  };

  const handleReply = (
    commentId: string,
    replyText: string,
    mentions: Array<{
      id: string;
      name: string;
      startIndex: number;
      endIndex: number;
    }>,
  ) => {
    addReplyToComment(commentId, replyText, mentions);
  };

  const handleVoiceReply = (commentId: string) => {
    setReplyingToComment(commentId);
    startRecording();
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase()),
  );

  const navigateToPrivateChat = (
    userId: string,
    name: string,
    avatar: string,
  ) => {
    if (userId && name && avatar) {
      router.push({
        pathname: `/private-chat/${userId}`,
        params: { username: name, userAvatar: avatar },
      });
    } else {
      console.error("Missing required parameters for navigation");
    }
  };

  return (
    <ScrollView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-gray-50"}`}
      ref={scrollViewRef}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Voice Message Card */}
      <View
        className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4 shadow-lg ${theme === "light" ? "border border-gray-100" : ""}`}
      >
        {/* User Info and Mood Tag */}
        <View className="flex-row items-center gap-3 mb-4">
          <TouchableOpacity
            onPress={() => navigateToPrivateChat(id, username, userAvatar)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: userAvatar }}
              className="w-12 h-12 rounded-full"
            />
          </TouchableOpacity>
          <View className="flex-1">
            <Text
              className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {username}
            </Text>
            <Text
              className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {timestamp}
            </Text>
          </View>
          <TouchableOpacity onPress={onMore}>
            <MoreVertical size={20} color="#e5e7eb" />
          </TouchableOpacity>
        </View>

        <View
          style={{ backgroundColor: `${moodColor}20` }}
          className="self-start px-2 py-1 rounded-full mb-4"
        >
          <Text style={{ color: moodColor }} className="text-xs">
            {mood}
          </Text>
        </View>

        {/* Audio Player */}
        <AudioPlayer
          duration={audioDuration}
          progress={progress}
          volume={volume}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />

        {/* Engagement Section */}
        <View
          className={`flex-row items-center gap-6 py-3 border-t border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
        >
          <TouchableOpacity
            onPress={onLike}
            className="flex-row items-center gap-2"
          >
            <Heart size={20} color="#8b5cf6" fill="#8b5cf6" />
            <Text className="text-purple-500">{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onComment}
            className="flex-row items-center gap-2"
          >
            <MessageCircle size={20} color="#9ca3af" />
            <Text className="text-gray-400">{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onShare}
            className="flex-row items-center gap-2 ml-auto"
          >
            <Share2 size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onReport}
            className="flex-row items-center gap-2"
          >
            <Flag size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Comments Section */}
      <View className="mt-6 px-4">
        <Text
          className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-4`}
        >
          Comments
        </Text>

        {/* Add Comment */}
        <View className="flex-row items-center gap-3 mb-6">
          <TouchableOpacity
            onPress={() =>
              navigateToPrivateChat(
                "u4",
                "You",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
              )
            }
            activeOpacity={0.7}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
              }}
              className="w-8 h-8 rounded-full"
            />
          </TouchableOpacity>
          <View className="flex-1 relative">
            <TextInput
              className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-gray-100 text-gray-900"} rounded-full py-2 pl-4 pr-16 text-sm`}
              placeholder="Add a comment..."
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
              value={comment}
              onChangeText={handleTextChange}
            />
            <View className="absolute right-3 top-1/2 -translate-y-1/2 flex-row">
              <TouchableOpacity onPress={startRecording} className="mr-2">
                <Mic size={16} color="#8b5cf6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitComment}>
                <Send size={16} color="#8b5cf6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Mention suggestions */}
        {showMentions && filteredUsers.length > 0 && (
          <View
            className={`${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"} rounded-lg mb-4 max-h-32 overflow-hidden`}
          >
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                className={`flex-row items-center p-2 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
                onPress={() => handleMentionSelect(user)}
              >
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    navigateToPrivateChat(user.id, user.name, user.avatar);
                  }}
                >
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                </TouchableOpacity>
                <Text
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  {user.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Comment List */}
        <View>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              commentId={comment.user.id}
              avatar={comment.user.avatar}
              username={comment.user.name}
              timeAgo={comment.timeAgo}
              text={comment.text}
              likes={comment.likes}
              replies={comment.replies}
              mentions={comment.mentions}
              isVoiceComment={comment.isVoiceComment}
              voiceDuration={comment.voiceDuration}
              onLike={() => console.log(`Like comment ${comment.id}`)}
              onReply={handleReply}
              onVoiceReply={handleVoiceReply}
              allUsers={allUsers}
            />
          ))}
        </View>
      </View>

      {/* Voice Recording Modal */}
      <Modal visible={showVoiceModal} transparent={true} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/70">
          <View
            className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} w-4/5 rounded-xl p-5`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-lg font-semibold`}
              >
                {replyingToComment ? "Voice Reply" : "Voice Comment"}
              </Text>
              <TouchableOpacity onPress={cancelRecording}>
                <X size={20} color="#e5e7eb" />
              </TouchableOpacity>
            </View>

            <View className="items-center py-6">
              <View className="w-20 h-20 rounded-full bg-purple-600/20 items-center justify-center mb-4">
                {isRecording ? (
                  <View className="w-16 h-16 rounded-full bg-purple-600 items-center justify-center animate-pulse">
                    <Mic size={32} color="#ffffff" />
                  </View>
                ) : (
                  <View className="w-16 h-16 rounded-full bg-purple-600 items-center justify-center">
                    <Mic size={32} color="#ffffff" />
                  </View>
                )}
              </View>

              <Text
                className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-xl`}
              >
                {Math.floor(recordingTime / 60)}:
                {recordingTime % 60 < 10 ? "0" : ""}
                {recordingTime % 60}
              </Text>
              <Text
                className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-sm mt-1`}
              >
                {30 - recordingTime} seconds remaining
              </Text>
            </View>

            <View className="flex-row justify-center gap-4 mt-2">
              <TouchableOpacity
                onPress={cancelRecording}
                className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} px-4 py-2 rounded-full`}
              >
                <Text
                  className={theme === "dark" ? "text-white" : "text-gray-700"}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              {isRecording ? (
                <TouchableOpacity
                  onPress={stopRecording}
                  className="bg-red-500 px-4 py-2 rounded-full flex-row items-center"
                >
                  <StopCircle size={16} color="#ffffff" className="mr-1" />
                  <Text className="text-white">Stop</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={saveVoiceComment}
                  className="bg-purple-600 px-4 py-2 rounded-full"
                >
                  <Text className="text-white">Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default VoiceDetailCard;
