import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { safeNavigator, safeWindow } from "@/lib/platform";

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(safeNavigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    safeWindow.addEventListener("online", handleOnline);
    safeWindow.addEventListener("offline", handleOffline);

    return () => {
      safeWindow.removeEventListener("online", handleOnline);
      safeWindow.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 animate-slide-down">
      <Alert className="bg-accent/90 backdrop-blur-sm border-accent-foreground/20">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="text-sm">
          You're offline. Viewing cached content.
        </AlertDescription>
      </Alert>
    </div>
  );
};
