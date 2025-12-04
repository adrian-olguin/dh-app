import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, CreditCard, Calendar, Users, Globe, BookOpen, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DonationHistory } from "@/components/DonationHistory";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const GiveTab = () => {
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState<"once" | "monthly">("once");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [35, 100, 250, 500];

  const impactStats = [
    { icon: Users, value: "35M", label: t('give.livesTouched') },
    { icon: Globe, value: "150+", label: t('give.countriesReached') },
    { icon: BookOpen, value: "1.3M", label: t('give.dailyDevotionals') },
    { icon: TrendingUp, value: "95%", label: t('give.viewerGrowth') },
  ];

  const impactStories = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80",
      nameKey: "give.stories.maria.name",
      locationKey: "give.stories.maria.location",
      storyKey: "give.stories.maria.story",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
      nameKey: "give.stories.john.name",
      locationKey: "give.stories.john.location",
      storyKey: "give.stories.john.story",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      nameKey: "give.stories.sarah.name",
      locationKey: "give.stories.sarah.location",
      storyKey: "give.stories.sarah.story",
    },
  ];

  const handleDonation = async () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (!amount || amount <= 0) {
      toast.error(t('give.error.invalidAmount'));
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-donation-checkout', {
        body: {
          amount,
          type: donationType,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error(t('give.error.processing'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pb-20 pt-3 px-3 max-w-md mx-auto">
      {/* Header Card */}
      <Card className="mb-3 bg-gradient-hero text-white shadow-elevated overflow-hidden animate-fade-in">
        <CardContent className="p-3 text-center relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
          <Heart className="w-7 h-7 mx-auto mb-1.5 relative" />
          <h2 className="text-lg font-display font-bold mb-0.5 relative">{t('give.thankYou')}</h2>
          <p className="text-white/90 text-sm relative">
            {t('give.helpMessage')}
          </p>
        </CardContent>
      </Card>

      {/* Impact Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {impactStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.label} 
              className="border border-primary/20 hover:border-primary/40 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-2.5 text-center">
                <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <div className="text-base font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground leading-tight">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Donation Form */}
      <Card className="shadow-elevated border-2 border-primary/10 mb-4">
        <CardHeader className="bg-gradient-card">
          <CardTitle className="text-xl font-display">{t('give.supportTitle')}</CardTitle>
          <CardDescription>{t('give.chooseGive')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          {/* Donation Type Tabs */}
          <Tabs defaultValue="once" value={donationType} onValueChange={(value) => setDonationType(value as "once" | "monthly")}>
            <TabsList className="grid w-full grid-cols-2 h-12 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 dark:from-amber-950 dark:via-yellow-950 dark:to-amber-950">
              <TabsTrigger value="once" className="text-base font-medium data-[state=active]:bg-background">
                {t('give.giveOnce')}
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-lg">
                <Calendar className="w-4 h-4 mr-2" />
                {t('give.partnerInHope')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="once" className="space-y-4 mt-4">
              {/* Quick Amount Buttons */}
              <div>
                <Label className="mb-3 block font-semibold">{t('give.selectAmount')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className="h-14 text-lg font-bold border-2"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <Label htmlFor="custom-amount-once" className="font-semibold">{t('give.customAmount')}</Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                  <Input
                    id="custom-amount-once"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 h-12 text-lg border-2"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold bg-gradient-accent shadow-accent"
                disabled={!selectedAmount && !customAmount || isProcessing}
                onClick={handleDonation}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {isProcessing ? t('give.processing') : t('give.continuePayment')}
              </Button>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4 mt-4">
              {/* Partner Benefits - VIP Style */}
              <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-white rounded-xl p-4 mb-3 shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/20 rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-xl">
                      {t('give.monthlyBenefits')}
                    </h3>
                  </div>
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-100 font-bold text-lg">✓</span>
                      <span className="text-white/95">{t('give.benefits.lasting')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-100 font-bold text-lg">✓</span>
                      <span className="text-white/95">{t('give.benefits.updates')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-100 font-bold text-lg">✓</span>
                      <span className="text-white/95">{t('give.benefits.resources')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-100 font-bold text-lg">✓</span>
                      <span className="text-white/95">{t('give.benefits.modify')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Monthly Amount Buttons */}
              <div>
                <Label className="mb-3 block font-semibold">{t('give.monthlyAmount')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className="h-14 text-lg font-bold border-2"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                    >
                      ${amount}/mo
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Monthly Amount */}
              <div>
                <Label htmlFor="custom-amount-monthly" className="font-semibold">{t('give.customMonthlyAmount')}</Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                  <Input
                    id="custom-amount-monthly"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 pr-20 h-12 text-lg border-2"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">/month</span>
                </div>
              </div>

              {/* Monthly Donate Button - VIP Style */}
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-2xl border-2 border-amber-300/50"
                disabled={!selectedAmount && !customAmount || isProcessing}
                onClick={handleDonation}
              >
                <Calendar className="w-5 h-5 mr-2" />
                {isProcessing ? t('give.processing') : t('give.becomePartner')}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Impact Statement */}
          <div className="text-center pt-4 border-t-2 border-border">
            <p className="text-sm text-muted-foreground">
              {donationType === "monthly" 
                ? t('give.monthlyImpact')
                : t('give.oneTimeImpact')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Impact Stories */}
      <div className="mb-4">
        <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          {t('give.livesChanged')}
        </h2>
        <div className="space-y-4">
          {impactStories.map((story, index) => (
            <Card 
              key={story.id} 
              className="overflow-hidden border-2 border-transparent hover:border-accent/30 transition-all animate-slide-up shadow-soft"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={story.image}
                      alt={t(story.nameKey)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-1">{t(story.nameKey)}</h3>
                    <p className="text-xs text-primary font-medium mb-2">{t(story.locationKey)}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(story.storyKey)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ways to Give */}
      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="text-lg font-display">{t('give.otherWays')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <p className="font-bold text-foreground mb-1">{t('give.mailGift')}</p>
            <p className="text-muted-foreground">Daily Hope Ministries<br />PO Box 80448<br />Rancho Santa Margarita, CA 92688</p>
          </div>
          <div className="text-sm">
            <p className="font-bold text-foreground mb-1">{t('give.phone')}</p>
            <p className="text-muted-foreground">
              {t('give.english')}: (800) 600-5004<br />
              {t('give.spanish')}: (949) 946-6194
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Non-Profit Disclaimer */}
      <div className="text-center mt-4 pb-2">
        <p className="text-xs text-muted-foreground">
          {t('give.nonprofit')}<br />
          {t('give.taxDeductible')}
        </p>
      </div>

      {/* Donation History Section */}
      <div className="mt-6">
        <DonationHistory />
      </div>
    </div>
  );
};
