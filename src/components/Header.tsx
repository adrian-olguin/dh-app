import { useState } from "react";
import { Search, LogIn, Moon, Sun, Languages, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSearchClick?: () => void;
  christmasMode?: boolean;
  onChristmasToggle?: () => void;
}

export const Header = ({ onSearchClick, christmasMode = false, onChristmasToggle }: HeaderProps) => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();
  const [authOpen, setAuthOpen] = useState(false);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/95 shadow-elevated border-b border-border transition-colors duration-300">
        <div className="px-4 py-3 safe-area-inset-top">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <div className="relative">
              {christmasMode && (
                <>
                  <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-red-500 animate-blink" />
                  <div className="absolute -top-2 left-8 w-3 h-3 rounded-full bg-green-500 animate-blink" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute -top-2 right-8 w-3 h-3 rounded-full bg-yellow-500 animate-blink" style={{ animationDelay: "1s" }} />
                  <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-blue-500 animate-blink" style={{ animationDelay: "1.5s" }} />
                  <div className="absolute top-10 -left-2 w-3 h-3 rounded-full bg-yellow-500 animate-blink" style={{ animationDelay: "0.75s" }} />
                  <div className="absolute top-10 -right-2 w-3 h-3 rounded-full bg-red-500 animate-blink" style={{ animationDelay: "1.25s" }} />
                </>
              )}
              <img 
                src="/images/daily-hope-logo.png" 
                alt="Daily Hope" 
                className="h-12 w-auto drop-shadow-lg dark:brightness-0 dark:invert transition-all duration-300"
              />
            </div>
            <div className="flex-1 flex justify-end gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onSearchClick}
                className="active:bg-primary/20 h-11 w-11 text-primary touch-manipulation"
              >
                <Search className="w-6 h-6" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="active:bg-primary/20 h-11 w-11 text-primary touch-manipulation"
                  >
                    <Languages className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('es')}>
                    Español
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('pt')}>
                    Português
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                    Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('de')}>
                    Deutsch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="active:bg-primary/20 h-11 w-11 text-primary touch-manipulation"
              >
                {theme === "dark" ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onChristmasToggle}
                className={`active:bg-primary/20 h-11 w-11 ${christmasMode ? 'text-red-500' : 'text-primary'} touch-manipulation`}
              >
                <Snowflake className="w-6 h-6" />
              </Button>
              {user ? (
                <UserMenu />
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setAuthOpen(true)}
                  className="active:bg-primary/20 h-11 w-11 text-primary touch-manipulation"
                >
                  <LogIn className="w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};
