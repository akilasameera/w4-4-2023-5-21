import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Mic,
  X,
  Smile,
} from "lucide-react-native";
import AudioPlayer from "../../components/AudioPlayer";
import CommentItem from "../../components/CommentItem";
import { useTheme } from "../contexts/ThemeContext";
import SimpleVoiceRecorder from "../../components/SimpleVoiceRecorder";

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

interface VoiceDetailsProps {
  postId: string;
  post?: any;
  comments?: CommentData[];
  onBack?: () => void;
}

const VoiceDetails: React.FC<VoiceDetailsProps> = ({
  postId,
  post: initialPost,
  comments: initialComments,
  onBack,
}) => {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [comment, setComment] = useState("");
  const [post, setPost] = useState<any>(initialPost);
  const [comments, setComments] = useState<CommentData[]>(
    initialComments || [],
  );
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [commentMentions, setCommentMentions] = useState<
    Array<{ id: string; name: string; startIndex: number; endIndex: number }>
  >([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingToComment, setReplyingToComment] = useState<string | null>(
    null,
  );

  const scrollViewRef = useRef<ScrollView>(null);

  // Mock users data for mentions
  const allUsers: MentionUser[] = [
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
    {
      id: "u5",
      name: "You",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
    },
  ];

  // Mock post data
  const mockPost = {
    id: "1",
    user: {
      id: "u4",
      name: "Alex Thompson",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
    },
    timestamp: "March 15, 2025 • 2:30 PM",
    mood: "Excited",
    moodColor: "#8b5cf6",
    audioDuration: "1:24",
    progress: 0.33,
    volume: 0.75,
    likes: 248,
    comments: 42,
  };

  // Mock comments data with nested structure
  const mockComments: CommentData[] = [
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
    {
      id: "c3",
      user: {
        id: "u3",
        name: "Jamie Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      },
      timeAgo: "3h ago",
      text: "Your voice is so calming. I always look forward to your posts.",
      likes: 5,
    },
  ];

  useEffect(() => {
    // In a real app, fetch post data based on ID
    if (!post) {
      setPost(mockPost);
    }
    if (!comments || comments.length === 0) {
      setComments(mockComments);
    }
  }, [postId, post, comments]);

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

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter") {
      if (replyingToComment) {
        if (comment.trim()) {
          handleReply(replyingToComment, comment, commentMentions);
          setComment("");
          setCommentMentions([]);
          setReplyingToComment(null);
        }
      } else {
        handleSubmitComment();
      }
      Keyboard.dismiss();
    }
  };

  const addEmoji = (emoji: string) => {
    setComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
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
    setShowVoiceModal(true);
  };

  const cancelRecording = () => {
    setShowVoiceModal(false);
    setReplyingToComment(null);
  };

  const saveVoiceComment = (recordingData: any) => {
    // Format duration as MM:SS
    const minutes = Math.floor(recordingData.duration / 60);
    const seconds = recordingData.duration % 60;
    const formattedDuration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (replyingToComment) {
      // Add voice reply to a specific comment
      addReplyToComment(replyingToComment, "", [], true, formattedDuration);
    } else {
      // Add top-level voice comment
      const newComment: CommentData = {
        id: `c${comments.length + 1}`,
        user: {
          id: "u5", // Current user
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
          id: "u5", // Current user
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
              id: "u5", // Current user
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
    // Scroll to the updated comment after a short delay to allow rendering
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleVoiceReply = (commentId: string) => {
    setReplyingToComment(commentId);
    setShowVoiceModal(true);
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase()),
  );

  if (!post) {
    return (
      <SafeAreaView
        className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-gray-50"} items-center justify-center`}
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 0,
        }}
      >
        <StatusBar
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
          backgroundColor={theme === "dark" ? "#111112" : "#ffffff"}
          translucent={Platform.OS === "android"}
        />
        <Text className={theme === "dark" ? "text-white" : "text-gray-800"}>
          Loading post...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-[#111112]" : "bg-white"}`}
      style={{
        paddingTop: Platform.OS === "android" ? 40 : 0,
      }}
    >
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#111112" : "#ffffff"}
        translucent={Platform.OS === "android"}
      />

      {/* Header */}
      <View
        className={`${theme === "dark" ? "bg-[#111112]/90" : "bg-white"} px-4 py-3 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack || (() => router.back())}>
            <ArrowLeft
              size={24}
              color={theme === "dark" ? "#e5e7eb" : "#374151"}
            />
          </TouchableOpacity>
          <Text
            className={`text-lg font-semibold ml-3 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            Voice Details
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Voice Message Card */}
        <View
          className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} rounded-xl p-4 shadow-sm ${theme === "light" ? "border border-gray-200" : ""}`}
        >
          {/* User Info and Mood Tag */}
          <View className="flex-row items-center gap-3 mb-4">
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: `/private-chat/${post.user.id}`,
                  params: {
                    username: post.user.name,
                    userAvatar: post.user.avatar,
                  },
                });
              }}
            >
              <Image
                source={{ uri: post.user.avatar }}
                className="w-12 h-12 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <Text
                className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {post.user.name}
              </Text>
              <Text
                className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                {post.timestamp}
              </Text>
            </View>
            <View
              style={{ backgroundColor: `${post.moodColor}20` }}
              className="px-2 py-1 rounded-full"
            >
              <Text
                style={{ color: post.moodColor }}
                className="text-xs font-medium"
              >
                {post.mood}
              </Text>
            </View>
          </View>

          {/* Audio Player */}
          <AudioPlayer
            duration={post.audioDuration}
            progress={post.progress}
            volume={post.volume}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />

          {/* Engagement Section */}
          <View
            className={`flex-row items-center gap-6 py-3 mt-2 border-t border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
          >
            <TouchableOpacity className="flex-row items-center gap-2">
              <Heart size={20} color="#8b5cf6" fill="#8b5cf6" />
              <Text className="text-purple-500">{post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-2">
              <MessageCircle
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text
                className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
              >
                {post.comments}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-2 ml-auto">
              <Share2
                size={20}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View className="mt-6">
          <Text
            className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-4`}
          >
            Comments
          </Text>

          {/* Mention suggestions */}
          {showMentions && filteredUsers.length > 0 && (
            <View
              className={`${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"} rounded-lg mb-4 max-h-32 overflow-hidden shadow-sm`}
            >
              {filteredUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  className={`flex-row items-center p-2 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
                  onPress={() => handleMentionSelect(user)}
                >
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <Text
                    className={
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }
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
              <View
                key={comment.id}
                className={`mb-4 ${theme === "dark" ? "" : "bg-white rounded-lg"}`}
              >
                <CommentItem
                  commentId={comment.id}
                  avatar={comment.user.avatar}
                  username={comment.user.name}
                  timeAgo={comment.timeAgo}
                  text={comment.text}
                  likes={comment.likes}
                  isVoiceComment={comment.isVoiceComment}
                  voiceDuration={comment.voiceDuration}
                  onLike={() => console.log(`Like comment ${comment.id}`)}
                  onReply={handleReply}
                  onVoiceReply={handleVoiceReply}
                  replies={comment.replies}
                  mentions={comment.mentions}
                  allUsers={allUsers}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Voice Recording Modal */}
      <SimpleVoiceRecorder
        visible={showVoiceModal}
        onClose={cancelRecording}
        onSave={saveVoiceComment}
      />

      {/* Emoji Picker Modal */}
      <Modal
        visible={showEmojiPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setShowEmojiPicker(false)}
        >
          <View className="flex-1 justify-end">
            <View
              className={`${theme === "dark" ? "bg-[#202024]" : "bg-white"} p-4 rounded-t-xl shadow-lg`}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-lg font-semibold`}
                >
                  Emojis
                </Text>
                <TouchableOpacity onPress={() => setShowEmojiPicker(false)}>
                  <X
                    size={20}
                    color={theme === "dark" ? "#e5e7eb" : "#374151"}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView className="max-h-60">
                <View className="flex-row flex-wrap justify-between">
                  {[
                    "😀",
                    "😃",
                    "😄",
                    "😁",
                    "😆",
                    "😅",
                    "😂",
                    "🤣",
                    "😊",
                    "😇",
                    "🙂",
                    "🙃",
                    "😉",
                    "😌",
                    "😍",
                    "🥰",
                    "😘",
                    "😗",
                    "😙",
                    "😚",
                    "😋",
                    "😛",
                    "😝",
                    "😜",
                    "🤪",
                    "🤨",
                    "🧐",
                    "🤓",
                    "😎",
                    "🤩",
                    "🥳",
                    "😏",
                    "😒",
                    "😞",
                    "😔",
                    "😟",
                    "😕",
                    "🙁",
                    "☹️",
                    "😣",
                    "😖",
                    "😫",
                    "😩",
                    "🥺",
                    "😢",
                    "😭",
                    "😤",
                    "😠",
                    "😡",
                    "🤬",
                    "🤯",
                    "😳",
                    "🥵",
                    "🥶",
                    "😱",
                    "😨",
                    "😰",
                    "😥",
                    "😓",
                    "🤗",
                    "🤔",
                    "🤭",
                    "🤫",
                    "🤥",
                    "😶",
                    "😐",
                    "😑",
                    "😬",
                    "🙄",
                    "😯",
                    "😦",
                    "😧",
                    "😮",
                    "😲",
                    "🥱",
                    "😴",
                    "🤤",
                    "😪",
                    "😵",
                    "🤐",
                    "🥴",
                    "🤢",
                    "🤮",
                    "🤧",
                    "😷",
                    "🤒",
                    "🤕",
                    "🤑",
                    "🤠",
                    "💋",
                    "💯",
                    "❤️",
                    "🧡",
                    "💛",
                    "💚",
                    "💙",
                    "💜",
                    "🖤",
                    "🤍",
                    "🤎",
                  ].map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => addEmoji(emoji)}
                      className="p-2 m-1"
                    >
                      <Text className="text-2xl">{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Comment Input Bar - Fixed at bottom */}
      <View
        className={`${theme === "dark" ? "bg-[#111112] border-t border-gray-800" : "bg-white border-t border-gray-200"} px-4 py-3 absolute bottom-0 left-0 right-0`}
      >
        <View className="flex-row items-center gap-3">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
            }}
            className="w-8 h-8 rounded-full"
          />
          <View className="flex-1 relative">
            <TextInput
              className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-gray-100 text-gray-800"} rounded-full py-2 pl-4 pr-16 text-sm`}
              placeholder={
                replyingToComment ? "Reply to comment..." : "Add a comment..."
              }
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#9ca3af"}
              value={comment}
              onChangeText={handleTextChange}
              onKeyPress={handleKeyPress}
              multiline={false}
              blurOnSubmit={false}
            />
            <View className="absolute right-3 top-1/2 -translate-y-1/2 flex-row">
              <TouchableOpacity
                onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                className="mr-2"
              >
                <Smile size={16} color="#8b5cf6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={startRecording} className="mr-2">
                <Mic size={16} color="#8b5cf6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  replyingToComment
                    ? () => {
                        if (comment.trim()) {
                          handleReply(
                            replyingToComment,
                            comment,
                            commentMentions,
                          );
                          setComment("");
                          setCommentMentions([]);
                          setReplyingToComment(null);
                        }
                      }
                    : handleSubmitComment
                }
              >
                <Send size={16} color="#8b5cf6" fill="#8b5cf6" />
              </TouchableOpacity>
            </View>
          </View>
          {replyingToComment && (
            <TouchableOpacity
              onPress={() => {
                setReplyingToComment(null);
                setComment("");
              }}
              className="ml-1"
            >
              <X size={16} color={theme === "dark" ? "#e5e7eb" : "#374151"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VoiceDetails;
