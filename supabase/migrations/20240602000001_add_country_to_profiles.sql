-- Add country field to profiles table
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS country TEXT;

-- Add country field to voice_messages table
ALTER TABLE IF EXISTS public.voice_messages
ADD COLUMN IF NOT EXISTS country TEXT;

-- Update realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE voice_messages;
