import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationSettings } from "@/components/NotificationSettings";
import { BookmarksView } from "@/components/BookmarksView";
import { User, Settings, LogOut, Bell, Bookmark } from "lucide-react";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 h-11 w-11 text-primary">
            <User className="w-6 h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setBookmarksOpen(true)}>
            <Bookmark className="w-4 h-4 mr-2" />
            My Bookmarks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Notification Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={bookmarksOpen} onOpenChange={setBookmarksOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <BookmarksView />
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Settings
            </DialogTitle>
          </DialogHeader>
          <NotificationSettings />
        </DialogContent>
      </Dialog>
    </>
  );
};
