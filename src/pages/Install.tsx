import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { safeWindow } from "@/lib/platform";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed
    const displayMode = safeWindow.matchMedia("(display-mode: standalone)");
    if (displayMode.matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    safeWindow.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      safeWindow.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation Not Available",
        description: "Please use your browser's menu to install this app.",
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      toast({
        title: "App Installed!",
        description: "Daily Hope has been added to your home screen.",
      });
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Install Daily Hope</CardTitle>
          <CardDescription>
            Get the full app experience on your phone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-lg font-medium">App Already Installed!</p>
              <p className="text-sm text-muted-foreground">
                You can find Daily Hope on your home screen.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Works offline - Access content anytime</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Fast loading - Optimized for mobile</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Push notifications - Stay updated</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>Home screen icon - Quick access</p>
                </div>
              </div>

              {isInstallable ? (
                <Button
                  onClick={handleInstallClick}
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Install App
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <p className="font-medium text-sm">Manual Installation:</p>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p><strong>iPhone:</strong> Tap Share → Add to Home Screen</p>
                      <p><strong>Android:</strong> Tap Menu (⋮) → Install App</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
