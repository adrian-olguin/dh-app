import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PlaybackPosition {
  episode_id: string;
  position: number;
  duration: number;
  completed: boolean;
}

export const usePlaybackPosition = (episodeId: string) => {
  const { user } = useAuth();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load saved position for this episode
  const loadPosition = useCallback(async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { data, error } = await supabase
        .from("playback_positions")
        .select("position, completed")
        .eq("user_id", user.id)
        .eq("episode_id", episodeId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading playback position:", error);
        return 0;
      }

      // Don't resume if episode was completed
      if (data?.completed) return 0;

      return data?.position || 0;
    } catch (error) {
      console.error("Error loading playback position:", error);
      return 0;
    }
  }, [user, episodeId]);

  // Save current position (debounced)
  const savePosition = useCallback(
    (position: number, duration: number) => {
      if (!user) return;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce saves to avoid too many database writes
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          // Mark as completed if within 30 seconds of the end
          const completed = duration - position < 30;

          const { error } = await supabase
            .from("playback_positions")
            .upsert(
              {
                user_id: user.id,
                episode_id: episodeId,
                position,
                duration,
                completed,
              },
              {
                onConflict: "user_id,episode_id",
              }
            );

          if (error) {
            console.error("Error saving playback position:", error);
          }
        } catch (error) {
          console.error("Error saving playback position:", error);
        }
      }, 2000); // Save every 2 seconds of playback
    },
    [user, episodeId]
  );

  // Mark episode as completed
  const markCompleted = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("playback_positions")
        .upsert(
          {
            user_id: user.id,
            episode_id: episodeId,
            position: 0,
            duration: 0,
            completed: true,
          },
          {
            onConflict: "user_id,episode_id",
          }
        );

      if (error) {
        console.error("Error marking episode as completed:", error);
      }
    } catch (error) {
      console.error("Error marking episode as completed:", error);
    }
  }, [user, episodeId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    loadPosition,
    savePosition,
    markCompleted,
  };
};

// Hook to get all playback positions for the user
export const usePlaybackPositions = () => {
  const { user } = useAuth();

  const getPositions = useCallback(async (): Promise<Map<string, PlaybackPosition>> => {
    if (!user) return new Map();

    try {
      const { data, error } = await supabase
        .from("playback_positions")
        .select("episode_id, position, duration, completed")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading playback positions:", error);
        return new Map();
      }

      const positionsMap = new Map<string, PlaybackPosition>();
      data?.forEach((pos) => {
        positionsMap.set(pos.episode_id, pos as PlaybackPosition);
      });

      return positionsMap;
    } catch (error) {
      console.error("Error loading playback positions:", error);
      return new Map();
    }
  }, [user]);

  return { getPositions };
};
