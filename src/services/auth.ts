import { Platform } from "react-native";
import * as SupabaseAuth from "./supabaseAuth";

// Use Supabase auth for all environments
export const {
  signUp,
  signIn,
  signOut,
  getSession,
  getCurrentUser,
  isAuthenticated,
  supabase,
} = SupabaseAuth;

// Re-export the types
export type {
  SignUpCredentials,
  SignInCredentials,
  AuthResponse,
} from "./supabaseAuth";

export default {
  signUp,
  signIn,
  signOut,
  getSession,
  getCurrentUser,
  isAuthenticated,
  supabase,
};
