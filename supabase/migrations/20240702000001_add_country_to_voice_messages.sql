-- Add country column to voice_messages table
ALTER TABLE voice_messages ADD COLUMN IF NOT EXISTS country TEXT;
