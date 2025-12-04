import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Bookmark {
  id: string;
  content_type: "devotional" | "message" | "audio";
  content_id: string;
  title: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export const useBookmarks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookmarks();
      loadTags();
    } else {
      setBookmarks([]);
      setTags([]);
      setLoading(false);
    }
  }, [user]);

  const loadBookmarks = async () => {
    try {
      const { data: bookmarksData, error } = await supabase
        .from("bookmarks")
        .select(`
          *,
          bookmark_tags(
            tag:tags(*)
          )
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedBookmarks: Bookmark[] = bookmarksData?.map((b) => ({
        id: b.id,
        content_type: b.content_type as "devotional" | "message" | "audio",
        content_id: b.content_id,
        title: b.title,
        notes: b.notes,
        created_at: b.created_at,
        updated_at: b.updated_at,
        tags: b.bookmark_tags?.map((bt: any) => bt.tag).filter(Boolean) || [],
      })) || [];

      setBookmarks(formattedBookmarks);
    } catch (error: any) {
      console.error("Error loading bookmarks:", error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("user_id", user!.id)
        .order("name");

      if (error) throw error;
      setTags(data || []);
    } catch (error: any) {
      console.error("Error loading tags:", error);
    }
  };

  const addBookmark = async (
    contentType: "devotional" | "message" | "audio",
    contentId: string,
    title: string,
    notes?: string
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save bookmarks",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          title,
          notes,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Bookmarked!",
        description: "Added to your favorites",
      });

      await loadBookmarks();
      return data;
    } catch (error: any) {
      console.error("Error adding bookmark:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add bookmark",
        variant: "destructive",
      });
      return null;
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId);

      if (error) throw error;

      toast({
        title: "Removed",
        description: "Bookmark removed",
      });

      await loadBookmarks();
    } catch (error: any) {
      console.error("Error removing bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    }
  };

  const updateBookmark = async (bookmarkId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("bookmarks")
        .update({ notes })
        .eq("id", bookmarkId);

      if (error) throw error;

      toast({
        title: "Updated",
        description: "Notes saved",
      });

      await loadBookmarks();
    } catch (error: any) {
      console.error("Error updating bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to update notes",
        variant: "destructive",
      });
    }
  };

  const createTag = async (name: string, color: string = "#3b82f6") => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("tags")
        .insert({
          user_id: user.id,
          name,
          color,
        })
        .select()
        .single();

      if (error) throw error;

      await loadTags();
      return data;
    } catch (error: any) {
      console.error("Error creating tag:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create tag",
        variant: "destructive",
      });
      return null;
    }
  };

  const addTagToBookmark = async (bookmarkId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from("bookmark_tags")
        .insert({
          bookmark_id: bookmarkId,
          tag_id: tagId,
        });

      if (error) throw error;
      await loadBookmarks();
    } catch (error: any) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  const removeTagFromBookmark = async (bookmarkId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from("bookmark_tags")
        .delete()
        .eq("bookmark_id", bookmarkId)
        .eq("tag_id", tagId);

      if (error) throw error;
      await loadBookmarks();
    } catch (error: any) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive",
      });
    }
  };

  const isBookmarked = (contentType: string, contentId: string) => {
    return bookmarks.some(
      (b) => b.content_type === contentType && b.content_id === contentId
    );
  };

  const getBookmark = (contentType: string, contentId: string) => {
    return bookmarks.find(
      (b) => b.content_type === contentType && b.content_id === contentId
    );
  };

  return {
    bookmarks,
    tags,
    loading,
    addBookmark,
    removeBookmark,
    updateBookmark,
    createTag,
    addTagToBookmark,
    removeTagFromBookmark,
    isBookmarked,
    getBookmark,
    refreshBookmarks: loadBookmarks,
  };
};
