import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Keyboard,
} from "react-native";
import { Heart, Mic, Send, User, X, Smile } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../src/contexts/ThemeContext";

interface MentionUser {
  id: string;
  name: string;
  avatar: string;
}

interface CommentData {
  id: string;
  user: {
    name: string;
    avatar: string;
    id: string;
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

interface CommentItemProps {
  avatar?: string;
  username?: string;
  timeAgo?: string;
  text?: string;
  likes?: number;
  commentId?: string;
  level?: number;
  replies?: CommentData[];
  mentions?: Array<{
    id: string;
    name: string;
    startIndex: number;
    endIndex: number;
  }>;
  isVoiceComment?: boolean;
  voiceDuration?: string;
  onLike?: () => void;
  onReply?: (
    commentId: string,
    replyText: string,
    mentions: Array<{
      id: string;
      name: string;
      startIndex: number;
      endIndex: number;
    }>,
  ) => void;
  onVoiceReply?: (commentId: string) => void;
  allUsers?: MentionUser[];
}

const CommentItem = ({
  avatar = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  username = "Sarah Chen",
  timeAgo = "1h ago",
  text = "This is a comment",
  likes = 0,
  commentId = "c1",
  level = 0,
  replies = [],
  mentions = [],
  isVoiceComment = false,
  voiceDuration = "0:15",
  onLike = () => console.log("Like comment"),
  onReply = () => console.log("Reply to comment"),
  onVoiceReply = () => console.log("Voice reply to comment"),
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
  ],
}: CommentItemProps) => {
  const { theme } = useTheme();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [commentMentions, setCommentMentions] = useState<
    Array<{ id: string; name: string; startIndex: number; endIndex: number }>
  >([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Function to navigate to private chat
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

  // Format text with mentions highlighted
  const formatTextWithMentions = () => {
    if (!mentions || mentions.length === 0)
      return (
        <Text
          className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          {text}
        </Text>
      );

    let lastIndex = 0;
    const textFragments = [];

    // Sort mentions by startIndex
    const sortedMentions = [...mentions].sort(
      (a, b) => a.startIndex - b.startIndex,
    );

    sortedMentions.forEach((mention, index) => {
      // Add text before mention
      if (mention.startIndex > lastIndex) {
        textFragments.push(
          <Text
            key={`text-${index}`}
            className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            {text.substring(lastIndex, mention.startIndex)}
          </Text>,
        );
      }

      // Add mention
      textFragments.push(
        <Text key={`mention-${index}`} className="text-sm text-purple-500">
          {text.substring(mention.startIndex, mention.endIndex)}
        </Text>,
      );

      lastIndex = mention.endIndex;
    });

    // Add remaining text after last mention
    if (lastIndex < text.length) {
      textFragments.push(
        <Text
          key="text-end"
          className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
        >
          {text.substring(lastIndex)}
        </Text>,
      );
    }

    return <Text className="text-sm">{textFragments}</Text>;
  };

  const handleTextChange = (newText: string) => {
    setReplyText(newText);

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
    const beforeMention = replyText.substring(0, mentionStartIndex);
    const afterMention = replyText.substring(
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
    setReplyText(newText);
    setShowMentions(false);
  };

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(commentId, replyText, commentMentions);
      setReplyText("");
      setShowReplyInput(false);
      setCommentMentions([]);
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Enter") {
      handleSubmitReply();
      Keyboard.dismiss();
    }
  };

  const addEmoji = (emoji: string) => {
    setReplyText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleVoiceReply = () => {
    // Call the onVoiceReply prop with the comment ID
    if (onVoiceReply) {
      onVoiceReply(commentId);
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase()),
  );

  // Allow nesting up to 10 levels for deeper conversations
  const canNest = level < 10;
  const marginLeft = level > 0 ? `${level * 16}px` : "0px";

  return (
    <View style={{ marginLeft }} className="mb-4">
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => navigateToPrivateChat(commentId, username, avatar)}
          activeOpacity={0.7}
        >
          <Image source={{ uri: avatar }} className="w-8 h-8 rounded-full" />
        </TouchableOpacity>
        <View className="flex-1">
          <View
            className={`${theme === "dark" ? "bg-[#202024]" : "bg-gray-100"} rounded-xl p-3`}
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text className="font-medium text-white">{username}</Text>
              <Text className="text-xs text-gray-400">{timeAgo}</Text>
            </View>

            {isVoiceComment ? (
              <View
                className={`flex-row items-center gap-2 mt-1 ${theme === "dark" ? "bg-[#2d2d33]" : "bg-gray-200"} p-2 rounded-lg`}
              >
                <TouchableOpacity activeOpacity={0.7}>
                  <View className="w-8 h-8 rounded-full bg-purple-600 items-center justify-center">
                    <Mic size={16} color="#ffffff" />
                  </View>
                </TouchableOpacity>
                <Text
                  className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Voice comment ({voiceDuration})
                </Text>
              </View>
            ) : (
              formatTextWithMentions()
            )}
          </View>

          <View className="flex-row items-center gap-4 mt-2 ml-2">
            <TouchableOpacity
              onPress={onLike}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <Heart
                size={14}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                {likes}
              </Text>
            </TouchableOpacity>
            {canNest && (
              <TouchableOpacity
                onPress={() => setShowReplyInput(!showReplyInput)}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  Reply
                </Text>
              </TouchableOpacity>
            )}
            {canNest && (
              <TouchableOpacity onPress={handleVoiceReply} activeOpacity={0.7}>
                <Text className="text-sm text-purple-500">Voice Reply</Text>
              </TouchableOpacity>
            )}
          </View>

          {showReplyInput && canNest && (
            <View className="mt-3 ml-2">
              <View className="relative">
                <TextInput
                  className={`w-full ${theme === "dark" ? "bg-[#202024] text-white" : "bg-gray-100 text-gray-800"} rounded-full py-2 pl-4 pr-20 text-sm`}
                  placeholder="Write a reply..."
                  placeholderTextColor="#9ca3af"
                  value={replyText}
                  onChangeText={handleTextChange}
                  onKeyPress={handleKeyPress}
                />
                <View className="absolute right-3 top-1/2 -translate-y-1/2 flex-row items-center">
                  <TouchableOpacity
                    onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="mr-2"
                    activeOpacity={0.7}
                  >
                    <Smile size={16} color="#8b5cf6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmitReply}
                    activeOpacity={0.7}
                  >
                    <Send size={16} color="#8b5cf6" />
                  </TouchableOpacity>
                </View>
              </View>

              {showMentions && filteredUsers.length > 0 && (
                <View
                  className={`${theme === "dark" ? "bg-[#202024]" : "bg-white border border-gray-200"} rounded-lg mt-1 max-h-32 overflow-hidden`}
                >
                  {filteredUsers.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      className={`flex-row items-center p-2 border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}
                      onPress={() => handleMentionSelect(user)}
                      activeOpacity={0.7}
                    >
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          navigateToPrivateChat(
                            user.id,
                            user.name,
                            user.avatar,
                          );
                        }}
                        activeOpacity={0.7}
                      >
                        <Image
                          source={{ uri: user.avatar }}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      </TouchableOpacity>
                      <Text
                        className={
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }
                      >
                        {user.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>

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

      {/* Render replies */}
      {replies.length > 0 && (
        <View className="mt-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              commentId={reply.id}
              avatar={reply.user.avatar}
              username={reply.user.name}
              timeAgo={reply.timeAgo}
              text={reply.text}
              likes={reply.likes}
              level={level + 1}
              replies={reply.replies}
              mentions={reply.mentions}
              isVoiceComment={reply.isVoiceComment}
              voiceDuration={reply.voiceDuration}
              onLike={onLike}
              onReply={onReply}
              onVoiceReply={onVoiceReply}
              allUsers={allUsers}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CommentItem;
