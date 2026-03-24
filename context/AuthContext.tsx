import React, { createContext, useContext, useState, ReactNode } from "react";
import { AuthContextValue, User } from "../types/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Mock auth — swap signIn / signUp bodies for a real backend call (e.g. Firebase, Supabase).
 * The shape of the context stays the same regardless of provider.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // TODO: replace with real auth call
      await new Promise((res) => setTimeout(res, 800)); // simulate network
      setUser({
        id: Math.random().toString(36).slice(2),
        email,
        displayName: email.split("@")[0],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, _password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // TODO: replace with real auth call
      await new Promise((res) => setTimeout(res, 800));
      setUser({
        id: Math.random().toString(36).slice(2),
        email,
        displayName,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}