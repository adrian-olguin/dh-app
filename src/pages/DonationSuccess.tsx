import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DonationSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount");
  const { t } = useTranslation();

  useEffect(() => {
    // Confetti or celebration animation could be added here
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-elevated animate-fade-in">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-display mb-2">
            {t('give.success.title')}
          </CardTitle>
          <CardDescription className="text-lg">
            {t('give.success.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 rounded-lg p-6 text-center">
            <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-2xl font-bold mb-1">
              ${amount ? parseFloat(amount).toFixed(2) : "0.00"}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('give.success.received')}
            </p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              {t('give.success.message')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('give.success.email')}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('give.success.returnHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
