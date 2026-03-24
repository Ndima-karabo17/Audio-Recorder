import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1a1819" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerTitle: "",
        }}
      />
    </AuthProvider>
  );
}