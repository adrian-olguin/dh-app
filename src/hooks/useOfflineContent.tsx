import { useState, useEffect } from "react";
import { toast } from "sonner";

const OFFLINE_STORAGE_KEY = "daily-hope-offline-content";

interface OfflineContent {
  id: string;
  type: "devotional" | "video" | "audio";
  title: string;
  date: string;
  content: any;
  savedAt: number;
}

export const useOfflineContent = () => {
  const [savedContent, setSavedContent] = useState<OfflineContent[]>([]);

  useEffect(() => {
    loadSavedContent();
  }, []);

  const loadSavedContent = () => {
    try {
      const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (stored) {
        setSavedContent(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading offline content:", error);
    }
  };

  const saveContent = (content: Omit<OfflineContent, "savedAt">) => {
    try {
      const newContent: OfflineContent = {
        ...content,
        savedAt: Date.now(),
      };

      const existing = [...savedContent];
      const index = existing.findIndex((item) => item.id === content.id);

      if (index >= 0) {
        toast.info("Already saved for offline");
        return;
      }

      existing.push(newContent);
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(existing));
      setSavedContent(existing);
      toast.success("Saved for offline access");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Could not save content");
    }
  };

  const removeContent = (id: string) => {
    try {
      const filtered = savedContent.filter((item) => item.id !== id);
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(filtered));
      setSavedContent(filtered);
      toast.success("Removed from offline storage");
    } catch (error) {
      console.error("Error removing content:", error);
      toast.error("Could not remove content");
    }
  };

  const isContentSaved = (id: string) => {
    return savedContent.some((item) => item.id === id);
  };

  return {
    savedContent,
    saveContent,
    removeContent,
    isContentSaved,
  };
};
