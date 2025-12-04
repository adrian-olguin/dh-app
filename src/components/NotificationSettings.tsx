import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications,
  checkNotificationPermission 
} from "@/utils/pushNotifications";
import { Bell, BellOff, Heart, Smile, Sparkles, HandHeart, Flame, MessageCircleHeart, ThumbsUp } from "lucide-react";

interface NotificationPreferences {
  devotionals_enabled: boolean;
  messages_enabled: boolean;
  audio_enabled: boolean;
  topic_faith: boolean;
  topic_hope: boolean;
  topic_love: boolean;
  topic_prayer: boolean;
  topic_peace: boolean;
  topic_encouragement: boolean;
  topic_gratitude: boolean;
}

export const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    devotionals_enabled: true,
    messages_enabled: true,
    audio_enabled: true,
    topic_faith: false,
    topic_hope: false,
    topic_love: false,
    topic_prayer: false,
    topic_peace: false,
    topic_encouragement: false,
    topic_gratitude: false,
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
      checkPushSubscription();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setPreferences({
          devotionals_enabled: data.devotionals_enabled,
          messages_enabled: data.messages_enabled,
          audio_enabled: data.audio_enabled,
          topic_faith: data.topic_faith,
          topic_hope: data.topic_hope,
          topic_love: data.topic_love,
          topic_prayer: data.topic_prayer,
          topic_peace: data.topic_peace,
          topic_encouragement: data.topic_encouragement,
          topic_gratitude: data.topic_gratitude,
        });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPushSubscription = async () => {
    const permission = checkNotificationPermission();
    setPushEnabled(permission === "granted");
  };

  const handleTogglePush = async () => {
    try {
      if (!pushEnabled) {
        await subscribeToPushNotifications(user!.id);
        setPushEnabled(true);
        toast({
          title: "Notifications enabled",
          description: "You'll receive push notifications for new content",
        });
      } else {
        await unsubscribeFromPushNotifications(user!.id);
        setPushEnabled(false);
        toast({
          title: "Notifications disabled",
          description: "You won't receive push notifications",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    setSaving(true);
    try {
      const { error } = await supabase
        .from("notification_preferences")
        .update({ [key]: value })
        .eq("user_id", user?.id);

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
      // Revert on error
      setPreferences(preferences);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading preferences...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Enable browser push notifications to stay updated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex flex-col gap-1">
              <span>Enable Push Notifications</span>
              <span className="text-sm text-muted-foreground font-normal">
                Receive alerts for new content
              </span>
            </Label>
            <Button
              variant={pushEnabled ? "default" : "outline"}
              onClick={handleTogglePush}
              className="gap-2"
            >
              {pushEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              {pushEnabled ? "Enabled" : "Enable"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Types</CardTitle>
          <CardDescription>
            Choose which types of content you want to be notified about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="devotionals" className="cursor-pointer">Daily Devotionals</Label>
            <Switch
              id="devotionals"
              checked={preferences.devotionals_enabled}
              onCheckedChange={(checked) => handlePreferenceChange("devotionals_enabled", checked)}
              disabled={saving}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="messages" className="cursor-pointer">Video Messages</Label>
            <Switch
              id="messages"
              checked={preferences.messages_enabled}
              onCheckedChange={(checked) => handlePreferenceChange("messages_enabled", checked)}
              disabled={saving}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="audio" className="cursor-pointer">Audio Episodes</Label>
            <Switch
              id="audio"
              checked={preferences.audio_enabled}
              onCheckedChange={(checked) => handlePreferenceChange("audio_enabled", checked)}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topics</CardTitle>
          <CardDescription>
            Select your favorite topics to personalize your notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(preferences) as Array<keyof NotificationPreferences>)
              .filter(key => key.startsWith("topic_"))
              .map((key) => {
                const topicName = key.replace("topic_", "");
                const displayName = topicName.charAt(0).toUpperCase() + topicName.slice(1);
                const isActive = preferences[key];
                
                // Icon mapping for each topic
                const topicIcons: Record<string, any> = {
                  faith: Flame,
                  hope: Sparkles,
                  love: Heart,
                  prayer: HandHeart,
                  peace: MessageCircleHeart,
                  encouragement: ThumbsUp,
                  gratitude: Smile,
                };
                
                const Icon = topicIcons[topicName] || Heart;
                
                return (
                  <button
                    key={key}
                    onClick={() => handlePreferenceChange(key, !isActive)}
                    disabled={saving}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{displayName}</span>
                  </button>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
