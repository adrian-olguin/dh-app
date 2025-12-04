-- Create playback_positions table to track episode progress
CREATE TABLE public.playback_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  episode_id TEXT NOT NULL,
  position FLOAT NOT NULL DEFAULT 0,
  duration FLOAT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, episode_id)
);

-- Enable Row Level Security
ALTER TABLE public.playback_positions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own playback positions"
ON public.playback_positions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own playback positions"
ON public.playback_positions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playback positions"
ON public.playback_positions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playback positions"
ON public.playback_positions
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_playback_position_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_played_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_playback_positions_updated_at
BEFORE UPDATE ON public.playback_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_playback_position_updated_at();

-- Create index for faster queries
CREATE INDEX idx_playback_positions_user_episode ON public.playback_positions(user_id, episode_id);
CREATE INDEX idx_playback_positions_last_played ON public.playback_positions(user_id, last_played_at DESC);