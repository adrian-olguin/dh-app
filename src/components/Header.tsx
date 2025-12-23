import { Search, Moon, Sun, Globe, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

interface HeaderProps {
  onSearchClick?: () => void;
}

// Default font size is 100%, range from 80% to 140%
const MIN_FONT_SIZE = 80;
const MAX_FONT_SIZE = 140;
const DEFAULT_FONT_SIZE = 100;
const FONT_SIZE_KEY = "app-font-size";

export const Header = ({
  onSearchClick,
}: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();
  const [isAndroid, setIsAndroid] = useState(false);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    // Detect if running on Android native app
    setIsAndroid(Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android");
    
    // Load saved font size from localStorage
    const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);
    if (savedFontSize) {
      const size = parseInt(savedFontSize, 10);
      if (size >= MIN_FONT_SIZE && size <= MAX_FONT_SIZE) {
        setFontSize(size);
        applyFontSize(size);
      }
    }
  }, []);

  const applyFontSize = (size: number) => {
    // Apply font size to the html element to scale all rem-based sizes
    document.documentElement.style.fontSize = `${size}%`;
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    applyFontSize(newSize);
    localStorage.setItem(FONT_SIZE_KEY, String(newSize));
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Android status bar is typically 24-28dp; use 28px as safe default
  // iOS uses env(safe-area-inset-top) which works natively
  const topPadding = isAndroid 
    ? "calc(28px + 12px)"  // 28px status bar + 12px padding
    : "calc(env(safe-area-inset-top, 0px) + 12px)";

  return (
    <>
      <header
        // Stick to the very top; header background will fill the notch area.
        className="sticky top-0 z-40 w-full bg-background shadow-md shadow-primary/5 border-b border-border transition-colors duration-300"
      >
        <div
          className="px-4 pb-3"
          // Push header content down by safe-area (iOS) or fixed amount (Android)
          style={{ paddingTop: topPadding }}
        >
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div className="flex-1">
              <img
                src="/images/daily-hope-logo.png"
                alt="Daily Hope"
                className="h-10 w-auto max-w-[200px] object-contain drop-shadow-lg dark:brightness-0 dark:invert transition-all duration-300"
              />
            </div>

            {/* Right Icon Row */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onSearchClick}
                className="active:bg-primary/20 h-10 w-10 text-primary touch-manipulation"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Language Selector - Globe icon */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="active:bg-primary/20 h-10 w-10 text-primary touch-manipulation"
                  >
                    <Globe className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("es")}>
                    Español
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Text Size - moved before dark mode */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="active:bg-primary/20 h-10 w-10 text-primary touch-manipulation"
                  >
                    <Type className="w-6 h-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Text Size</span>
                      <span className="text-sm text-muted-foreground">{fontSize}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">A</span>
                      <Slider
                        value={[fontSize]}
                        onValueChange={handleFontSizeChange}
                        min={MIN_FONT_SIZE}
                        max={MAX_FONT_SIZE}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-muted-foreground">A</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleFontSizeChange([DEFAULT_FONT_SIZE])}
                    >
                      Reset to Default
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Light/Dark Mode - now at the end */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="active:bg-primary/20 h-10 w-10 text-primary touch-manipulation"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
