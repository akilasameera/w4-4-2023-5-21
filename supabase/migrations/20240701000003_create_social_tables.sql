-- Create followers table
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES profiles(id) NOT NULL,
  following_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Enable row level security
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

-- Create policies for followers
DROP POLICY IF EXISTS "Followers are viewable by everyone" ON followers;
CREATE POLICY "Followers are viewable by everyone"
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

-- Enable realtime for followers
ALTER PUBLICATION supabase_realtime ADD TABLE followers;

-- Create private_messages table
CREATE TABLE IF NOT EXISTS private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  text TEXT,
  is_voice_message BOOLEAN DEFAULT FALSE,
  voice_url TEXT,
  voice_duration TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for private_messages
DROP POLICY IF EXISTS "Users can view their own private messages" ON private_messages;
CREATE POLICY "Users can view their own private messages"
ON private_messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Users can send private messages" ON private_messages;
CREATE POLICY "Users can send private messages"
ON private_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their own private messages" ON private_messages;
CREATE POLICY "Users can update their own private messages"
ON private_messages FOR UPDATE
USING (auth.uid() = sender_id OR (auth.uid() = recipient_id AND (is_read IS NOT NULL)));

DROP POLICY IF EXISTS "Users can delete their own private messages" ON private_messages;
CREATE POLICY "Users can delete their own private messages"
ON private_messages FOR DELETE
USING (auth.uid() = sender_id);

-- Enable realtime for private_messages
ALTER PUBLICATION supabase_realtime ADD TABLE private_messages;
