import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface PrivateChatListProps {
  conversations?: ChatUser[];
  onSelectChat?: (user: ChatUser) => void;
}

const PrivateChatList: React.FC<PrivateChatListProps> = ({
  conversations = [],
  onSelectChat = () => {},
}) => {
  const router = useRouter();

  const handleChatPress = (item: ChatUser) => {
    onSelectChat(item);
  };

  const renderConversationItem = ({ item }: { item: ChatUser }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 border-b border-gray-800"
      activeOpacity={0.7}
      onPress={() => handleChatPress(item)}
    >
      <View className="relative">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        {item.online && (
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111112]" />
        )}
      </View>
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-semibold">{item.name}</Text>
          <Text className="text-gray-400 text-xs">{item.time}</Text>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text
            className="text-gray-400 text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View className="bg-[#8b5cf6] rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {item.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={conversations}
      renderItem={renderConversationItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      className="flex-1 pb-20"
    />
  );
};

export default PrivateChatList;
