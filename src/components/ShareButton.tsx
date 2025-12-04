import { Share2, Mail, MessageCircle, Facebook, Twitter, Video, MessageSquare, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { safeWindow } from "@/lib/platform";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  label?: string;
}

export const ShareButton = ({ title, text, url = safeWindow.location.href, label = "Share Devotional" }: ShareButtonProps) => {
  const { t } = useTranslation();
  const shareData = { title, text, url };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success(t('common.thanksSharing'));
      } catch (error: any) {
        if (error.name !== "AbortError") {
          toast.error(t('common.couldNotShare'));
        }
      }
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${text}\n\n${url}`);
    safeWindow.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleSMS = () => {
    const message = encodeURIComponent(`${title}\n\n${text}\n\n${url}`);
    safeWindow.open(`sms:?body=${message}`, "_blank");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`${title}\n\n${text}\n\n${url}`);
    safeWindow.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleTwitter = () => {
    const tweetText = encodeURIComponent(`${title}\n\n${text}\n\n${url}`);
    safeWindow.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  const handleFacebook = () => {
    safeWindow.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  const handleTikTok = async () => {
    const content = `${title}\n\n${text}\n\n${url}`;
    try {
      await navigator.clipboard.writeText(content);
      toast.success(t('common.copiedTikTok'), {
        description: t('common.copiedTikTokDesc'),
        duration: 5000,
      });
    } catch (error) {
      toast.error(t('common.couldNotCopy'));
    }
  };

  const handleInstagram = async () => {
    const content = `${title}\n\n${text}\n\n${url}`;
    try {
      await navigator.clipboard.writeText(content);
      toast.success(t('common.copiedInstagram'), {
        description: t('common.copiedInstagramDesc'),
        duration: 5000,
      });
    } catch (error) {
      toast.error(t('common.couldNotCopy'));
    }
  };

  // Check if native share is available
  const hasNativeShare = typeof navigator !== "undefined" && navigator.share;

  if (hasNativeShare) {
    return (
      <Button
        onClick={handleNativeShare}
        variant="outline"
        size="lg"
        className="w-full text-primary"
      >
        <Share2 className="w-4 h-4 mr-2" />
        {label}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="w-full text-primary">
          <Share2 className="w-4 h-4 mr-2" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem onClick={handleTikTok}>
          <Video className="w-4 h-4 mr-2" />
          {t('common.respondTikTok')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleInstagram}>
          <Instagram className="w-4 h-4 mr-2" />
          {t('common.shareInstagram')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>
          <Mail className="w-4 h-4 mr-2" />
          {t('common.shareEmail')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSMS}>
          <MessageCircle className="w-4 h-4 mr-2" />
          {t('common.textFriend')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsApp}>
          <MessageSquare className="w-4 h-4 mr-2" />
          {t('common.shareWhatsApp')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitter}>
          <Twitter className="w-4 h-4 mr-2" />
          {t('common.shareTwitter')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebook}>
          <Facebook className="w-4 h-4 mr-2" />
          {t('common.shareFacebook')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
