import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Receipt, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { safeWindow } from "@/lib/platform";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  donation_type: string;
  payment_method: string | null;
  status: string;
  receipt_url: string | null;
  transaction_id: string | null;
  notes: string | null;
  created_at: string;
}

export const DonationHistory = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast({
        title: t("give.history.errorTitle"),
        description: t("give.history.errorDescription"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (receiptUrl: string) => {
    safeWindow.open(receiptUrl, "_blank");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { variant: "default" as const, label: t("give.history.statusCompleted") },
      pending: { variant: "secondary" as const, label: t("give.history.statusPending") },
      failed: { variant: "destructive" as const, label: t("give.history.statusFailed") },
      refunded: { variant: "outline" as const, label: t("give.history.statusRefunded") },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">{t("give.history.loginRequired")}</h3>
        <p className="text-muted-foreground">{t("give.history.loginDescription")}</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">{t("give.history.noDonations")}</h3>
        <p className="text-muted-foreground">{t("give.history.noDonationsDescription")}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t("give.history.title")}</h2>
          <p className="text-muted-foreground">{t("give.history.description")}</p>
        </div>
      </div>

      {donations.map((donation) => (
        <Card key={donation.id} className="p-6 hover:shadow-soft transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {formatAmount(donation.amount, donation.currency)}
                    </span>
                    {getStatusBadge(donation.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(donation.created_at), "PPP")}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">
                  {donation.donation_type === "monthly"
                    ? t("give.history.typeMonthly")
                    : t("give.history.typeOneTime")}
                </Badge>
                {donation.payment_method && (
                  <Badge variant="outline">{donation.payment_method}</Badge>
                )}
                {donation.transaction_id && (
                  <span className="text-xs">ID: {donation.transaction_id}</span>
                )}
              </div>

              {donation.notes && (
                <p className="text-sm text-muted-foreground">{donation.notes}</p>
              )}
            </div>

            {donation.receipt_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadReceipt(donation.receipt_url!)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t("give.history.downloadReceipt")}
              </Button>
            )}
          </div>
        </Card>
      ))}

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          {t("give.history.totalDonations", { count: donations.length })}
        </p>
      </div>
    </div>
  );
};
