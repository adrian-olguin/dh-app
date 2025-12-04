import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookmarks, Bookmark } from "@/hooks/useBookmarks";
import { Video, Headphones, BookOpen, Trash2, Edit2, Tag as TagIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";

export const BookmarksView = () => {
  const { bookmarks, tags, loading, removeBookmark, updateBookmark, createTag, addTagToBookmark, removeTagFromBookmark } = useBookmarks();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [showNewTag, setShowNewTag] = useState(false);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesType = filterType === "all" || bookmark.content_type === filterType;
    const matchesTag = filterTag === "all" || bookmark.tags.some(t => t.id === filterTag);
    const matchesSearch = searchQuery === "" || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bookmark.notes && bookmark.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesTag && matchesSearch;
  });

  const handleEditNotes = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setEditNotes(bookmark.notes || "");
  };

  const handleSaveNotes = async () => {
    if (editingBookmark) {
      await updateBookmark(editingBookmark.id, editNotes);
      setEditingBookmark(null);
    }
  };

  const handleCreateTag = async () => {
    if (newTagName.trim()) {
      await createTag(newTagName.trim());
      setNewTagName("");
      setShowNewTag(false);
    }
  };

  const handleAddTag = async (bookmarkId: string, tagId: string) => {
    await addTagToBookmark(bookmarkId, tagId);
  };

  const handleRemoveTag = async (bookmarkId: string, tagId: string) => {
    await removeTagFromBookmark(bookmarkId, tagId);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
      case "message":
        return Video;
      case "audio":
        return Headphones;
      case "devotional":
        return BookOpen;
      default:
        return BookOpen;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">My Bookmarks</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="devotional">Devotionals</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tag Management */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Your tags:</span>
          {tags.map((tag) => (
            <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
              {tag.name}
            </Badge>
          ))}
          {showNewTag ? (
            <div className="flex gap-2">
              <Input
                placeholder="New tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="w-32 h-8"
                onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
              />
              <Button size="sm" onClick={handleCreateTag}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowNewTag(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setShowNewTag(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Tag
            </Button>
          )}
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {bookmarks.length === 0 ? (
              <p>No bookmarks yet. Start saving your favorite content!</p>
            ) : (
              <p>No bookmarks match your filters.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map((bookmark) => {
            const Icon = getIcon(bookmark.content_type);
            
            return (
              <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{bookmark.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(bookmark.created_at), "MMM d, yyyy")}
                        </p>
                      </div>

                      {bookmark.notes && (
                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                          {bookmark.notes}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {bookmark.tags.map((tag) => (
                          <Badge 
                            key={tag.id} 
                            style={{ backgroundColor: tag.color }}
                            className="gap-1"
                          >
                            {tag.name}
                            <button
                              onClick={() => handleRemoveTag(bookmark.id, tag.id)}
                              className="ml-1 hover:opacity-70"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        
                        <Select onValueChange={(tagId) => handleAddTag(bookmark.id, tagId)}>
                          <SelectTrigger className="h-6 w-24 text-xs">
                            <TagIcon className="w-3 h-3 mr-1" />
                            Add tag
                          </SelectTrigger>
                          <SelectContent>
                            {tags
                              .filter(t => !bookmark.tags.some(bt => bt.id === t.id))
                              .map((tag) => (
                                <SelectItem key={tag.id} value={tag.id}>
                                  {tag.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditNotes(bookmark)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          {bookmark.notes ? "Edit Notes" : "Add Notes"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeBookmark(bookmark.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Notes Dialog */}
      <Dialog open={!!editingBookmark} onOpenChange={() => setEditingBookmark(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">{editingBookmark?.title}</p>
              <Textarea
                placeholder="Add your notes here..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingBookmark(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
