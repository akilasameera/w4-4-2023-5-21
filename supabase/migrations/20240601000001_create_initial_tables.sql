-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voice_messages table
CREATE TABLE IF NOT EXISTS voice_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  audio_url TEXT NOT NULL,
  duration TEXT NOT NULL,
  mood TEXT,
  mood_color TEXT,
  language TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_message_id UUID REFERENCES voice_messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT,
  is_voice_comment BOOLEAN DEFAULT FALSE,
  voice_url TEXT,
  voice_duration TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentions table for tracking @mentions in comments
CREATE TABLE IF NOT EXISTS mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_index INTEGER NOT NULL,
  end_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table for voice messages
CREATE TABLE IF NOT EXISTS voice_message_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_message_id UUID REFERENCES voice_messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(voice_message_id, user_id)
);

-- Create likes table for comments
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create followers table for user relationships
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create private_messages table for direct messaging
CREATE TABLE IF NOT EXISTS private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT,
  is_voice_message BOOLEAN DEFAULT FALSE,
  voice_url TEXT,
  voice_duration TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_message_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for voice_messages
DROP POLICY IF EXISTS "Anyone can view voice messages" ON voice_messages;
CREATE POLICY "Anyone can view voice messages"
  ON voice_messages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own voice messages" ON voice_messages;
CREATE POLICY "Users can insert own voice messages"
  ON voice_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own voice messages" ON voice_messages;
CREATE POLICY "Users can update own voice messages"
  ON voice_messages FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own voice messages" ON voice_messages;
CREATE POLICY "Users can delete own voice messages"
  ON voice_messages FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for comments
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own comments" ON comments;
CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for likes
DROP POLICY IF EXISTS "Anyone can view voice message likes" ON voice_message_likes;
CREATE POLICY "Anyone can view voice message likes"
  ON voice_message_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own voice message likes" ON voice_message_likes;
CREATE POLICY "Users can insert own voice message likes"
  ON voice_message_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own voice message likes" ON voice_message_likes;
CREATE POLICY "Users can delete own voice message likes"
  ON voice_message_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for comment likes
DROP POLICY IF EXISTS "Anyone can view comment likes" ON comment_likes;
CREATE POLICY "Anyone can view comment likes"
  ON comment_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own comment likes" ON comment_likes;
CREATE POLICY "Users can insert own comment likes"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comment likes" ON comment_likes;
CREATE POLICY "Users can delete own comment likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for followers
DROP POLICY IF EXISTS "Anyone can view followers" ON followers;
CREATE POLICY "Anyone can view followers"
  ON followers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON followers;
CREATE POLICY "Users can follow others"
  ON followers FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow others" ON followers;
CREATE POLICY "Users can unfollow others"
  ON followers FOR DELETE
  USING (auth.uid() = follower_id);

-- Create policies for private messages
DROP POLICY IF EXISTS "Users can view their own messages" ON private_messages;
CREATE POLICY "Users can view their own messages"
  ON private_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can send messages" ON private_messages;
CREATE POLICY "Users can send messages"
  ON private_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their own messages" ON private_messages;
CREATE POLICY "Users can update their own messages"
  ON private_messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Enable realtime subscriptions for all tables
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table voice_messages;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table mentions;
alter publication supabase_realtime add table voice_message_likes;
alter publication supabase_realtime add table comment_likes;
alter publication supabase_realtime add table followers;
alter publication supabase_realtime add table private_messages;
