-- Create voice_messages table
CREATE TABLE IF NOT EXISTS voice_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
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

-- Enable row level security
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for voice_messages
DROP POLICY IF EXISTS "Voice messages are viewable by everyone" ON voice_messages;
CREATE POLICY "Voice messages are viewable by everyone"
ON voice_messages FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own voice messages" ON voice_messages;
CREATE POLICY "Users can insert their own voice messages"
ON voice_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own voice messages" ON voice_messages;
CREATE POLICY "Users can update their own voice messages"
ON voice_messages FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own voice messages" ON voice_messages;
CREATE POLICY "Users can delete their own voice messages"
ON voice_messages FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for voice_messages
ALTER PUBLICATION supabase_realtime ADD TABLE voice_messages;

-- Create voice_message_likes table
CREATE TABLE IF NOT EXISTS voice_message_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  voice_message_id UUID REFERENCES voice_messages(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, voice_message_id)
);

-- Enable row level security
ALTER TABLE voice_message_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for voice_message_likes
DROP POLICY IF EXISTS "Users can view likes" ON voice_message_likes;
CREATE POLICY "Users can view likes"
ON voice_message_likes FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own likes" ON voice_message_likes;
CREATE POLICY "Users can insert their own likes"
ON voice_message_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON voice_message_likes;
CREATE POLICY "Users can delete their own likes"
ON voice_message_likes FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for voice_message_likes
ALTER PUBLICATION supabase_realtime ADD TABLE voice_message_likes;

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  voice_message_id UUID REFERENCES voice_messages(id) NOT NULL,
  text TEXT,
  is_voice_comment BOOLEAN DEFAULT FALSE,
  voice_url TEXT,
  voice_duration TEXT,
  parent_id UUID REFERENCES comments(id),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id)
);

-- Enable row level security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert comments" ON comments;
CREATE POLICY "Users can insert comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  comment_id UUID REFERENCES comments(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- Enable row level security
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for comment_likes
DROP POLICY IF EXISTS "Users can view comment likes" ON comment_likes;
CREATE POLICY "Users can view comment likes"
ON comment_likes FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own comment likes" ON comment_likes;
CREATE POLICY "Users can insert their own comment likes"
ON comment_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comment likes" ON comment_likes;
CREATE POLICY "Users can delete their own comment likes"
ON comment_likes FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for comment_likes
ALTER PUBLICATION supabase_realtime ADD TABLE comment_likes;

-- Create mentions table
CREATE TABLE IF NOT EXISTS mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  comment_id UUID REFERENCES comments(id) NOT NULL,
  start_index INTEGER NOT NULL,
  end_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;

-- Create policies for mentions
DROP POLICY IF EXISTS "Mentions are viewable by everyone" ON mentions;
CREATE POLICY "Mentions are viewable by everyone"
ON mentions FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert mentions" ON mentions;
CREATE POLICY "Users can insert mentions"
ON mentions FOR INSERT
WITH CHECK (true);

-- Enable realtime for mentions
ALTER PUBLICATION supabase_realtime ADD TABLE mentions;
