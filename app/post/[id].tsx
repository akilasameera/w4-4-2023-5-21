import React from "react";
import { useLocalSearchParams } from "expo-router";
import VoiceDetails from "../../src/components/VoiceDetails";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <VoiceDetails postId={id || "1"} />;
}
