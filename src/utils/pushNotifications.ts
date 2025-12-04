import { supabase } from "@/integrations/supabase/client";

// Convert VAPID public key to Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications");
  }
  
  const permission = await Notification.requestPermission();
  return permission;
};

export const subscribeToPushNotifications = async (userId: string) => {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Push notifications are not supported in this browser");
    }

    // Request notification permission
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    // VAPID public key (you'll need to generate this)
    // For demo purposes, using a placeholder - in production, generate your own
    const vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8-fTnm3sfhFJDNLHI4dZZsNNZKs6WeMfC9vBkIgwNZQOIFqX3HCh3c";
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    // Save subscription to database
    const subscriptionJson = subscription.toJSON();
    const { error } = await supabase.from("push_subscriptions").upsert({
      user_id: userId,
      endpoint: subscriptionJson.endpoint!,
      p256dh: subscriptionJson.keys!.p256dh,
      auth: subscriptionJson.keys!.auth,
    });

    if (error) throw error;

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    throw error;
  }
};

export const unsubscribeFromPushNotifications = async (userId: string) => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
    }

    // Remove from database
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    throw error;
  }
};

export const checkNotificationPermission = (): NotificationPermission => {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
};
