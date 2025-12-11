import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  label?: string;
}

export const ShareButton = ({
  title,
  text,
  url,
  label = "Share Devotional",
}: ShareButtonProps) => {
  const { t } = useTranslation();
  // Use the provided URL only if it's a valid external URL
  // Never share capacitor://localhost or other internal URLs
  const getShareUrl = (): string => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    // Fallback to main website if no valid external URL is provided
    return 'https://www.pastorrick.com';
  };
  const shareUrl = getShareUrl();
  const shareData = { title, text, url: shareUrl };

  const handleShare = async () => {
    try {
      // 1) Native iOS / Android via Capacitor
      if (Capacitor.isNativePlatform()) {
        await Share.share(shareData);
        toast.success(t("common.thanksSharing"));
        return;
      }

      // 2) Web Share API (Safari / modern browsers)
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share(shareData);
        toast.success(t("common.thanksSharing"));
        return;
      }

      // 3) Fallback: copy link to clipboard
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${title}\n\n${text}\n\n${shareUrl}`
        );
        toast.success("Link copied to clipboard");
        return;
      }

      toast.error(t("common.couldNotShare"));
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        toast.error(t("common.couldNotShare"));
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="lg"
      className="w-full text-primary"
    >
      <Share2 className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};
