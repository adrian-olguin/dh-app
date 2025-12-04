import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  contentType?: 'devotional' | 'message' | 'audio';
  topics?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: NotificationPayload = await req.json();
    console.log('Sending notification:', payload);

    // Get users who should receive this notification
    const { data: preferences, error: prefError } = await supabaseClient
      .from('notification_preferences')
      .select('user_id, devotionals_enabled, messages_enabled, audio_enabled, topic_faith, topic_hope, topic_love, topic_prayer, topic_peace, topic_encouragement, topic_gratitude');

    if (prefError) throw prefError;

    // Filter users based on preferences
    const eligibleUsers = preferences?.filter(pref => {
      // Check content type preference
      const contentTypeMatch = 
        (payload.contentType === 'devotional' && pref.devotionals_enabled) ||
        (payload.contentType === 'message' && pref.messages_enabled) ||
        (payload.contentType === 'audio' && pref.audio_enabled);

      if (!contentTypeMatch) return false;

      // If topics are specified, check if user has any matching topic enabled
      if (payload.topics && payload.topics.length > 0) {
        const hasMatchingTopic = payload.topics.some(topic => {
          const topicKey = `topic_${topic.toLowerCase()}` as keyof typeof pref;
          return pref[topicKey] === true;
        });
        return hasMatchingTopic;
      }

      return true;
    });

    if (!eligibleUsers || eligibleUsers.length === 0) {
      console.log('No eligible users found for notification');
      return new Response(
        JSON.stringify({ message: 'No eligible users', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get push subscriptions for eligible users
    const userIds = eligibleUsers.map(u => u.user_id);
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    if (subError) throw subError;

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found');
      return new Response(
        JSON.stringify({ message: 'No subscriptions', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notifications using Web Push API
    // Note: In production, you would use web-push library with VAPID keys
    // For now, this is a placeholder that logs the notifications
    let sentCount = 0;
    for (const subscription of subscriptions) {
      try {
        console.log(`Would send notification to user ${subscription.user_id}:`, {
          endpoint: subscription.endpoint,
          title: payload.title,
          body: payload.body,
        });
        
        // In production, use web-push library here:
        // await webpush.sendNotification(
        //   {
        //     endpoint: subscription.endpoint,
        //     keys: {
        //       p256dh: subscription.p256dh,
        //       auth: subscription.auth,
        //     }
        //   },
        //   JSON.stringify({
        //     title: payload.title,
        //     body: payload.body,
        //     url: payload.url,
        //     tag: payload.tag,
        //   })
        // );
        
        sentCount++;
      } catch (error) {
        console.error(`Failed to send to user ${subscription.user_id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Notifications processed', 
        sent: sentCount,
        eligible: eligibleUsers.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending notifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
