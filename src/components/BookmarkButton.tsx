import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/contexts/AuthContext";

interface BookmarkButtonProps {
  contentType: "devotional" | "message" | "audio";
  contentId: string;
  title: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
}

export const BookmarkButton = ({
  contentType,
  contentId,
  title,
  size = "sm",
  variant = "ghost",
}: BookmarkButtonProps) => {
  const { user } = useAuth();
  const { isBookmarked, getBookmark, addBookmark, removeBookmark } = useBookmarks();
  const [loading, setLoading] = useState(false);

  const bookmarked = isBookmarked(contentType, contentId);
  const bookmark = getBookmark(contentType, contentId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      return;
    }

    setLoading(true);
    try {
      if (bookmarked && bookmark) {
        await removeBookmark(bookmark.id);
      } else {
        await addBookmark(contentType, contentId, title);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={loading}
      className="gap-2"
    >
      {bookmarked ? (
        <>
          <BookmarkCheck className="w-4 h-4 fill-current" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Save
        </>
      )}
    </Button>
  );
};
