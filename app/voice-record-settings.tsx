import React from "react";
import { Stack } from "expo-router";
import VoiceRecordSettings from "../components/VoiceRecordSettings";

export default function VoiceRecordSettingsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <VoiceRecordSettings />
    </>
  );
}
