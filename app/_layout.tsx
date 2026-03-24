import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1a1819" },
        headerTintColor: "#fff",
        headerShadowVisible: false,
        headerTitle: "",
      }}
    />
  );
}