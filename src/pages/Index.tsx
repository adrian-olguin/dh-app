import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TabNavigation } from "@/components/TabNavigation";
import { WatchTab } from "@/components/tabs/WatchTab";
import { ListenTab } from "@/components/tabs/ListenTab";
import { ReadTab } from "@/components/tabs/ReadTab";
import { GiveTab } from "@/components/tabs/GiveTab";
import { SearchDialog } from "@/components/SearchDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("read");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{
    type: "devotional" | "audio" | "video";
    id: string;
  } | null>(null);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // If Spanish is selected, avoid showing the watch tab
  useEffect(() => {
    if (i18n.language?.startsWith("es") && activeTab === "watch") {
      setActiveTab("read");
    }
  }, [i18n.language, activeTab]);

  const handleNavigateToContent = (payload: { type: "devotional" | "audio" | "video"; id: string }) => {
    if (payload.type === "devotional") setActiveTab("read");
    if (payload.type === "audio") setActiveTab("listen");
    if (payload.type === "video") setActiveTab("watch");
    setPendingSelection(payload);
    setSearchOpen(false);
  };

  const clearSelection = () => setPendingSelection(null);

  return (
    <ErrorBoundary
      fallbackTitle="Page Error"
      fallbackDescription="This page encountered an error. Try navigating to another section."
    >
      <div className="min-h-screen bg-background">
        <SearchDialog
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onNavigateToContent={handleNavigateToContent}
        />

        <Header onSearchClick={() => setSearchOpen(true)} />

        <main className="pb-20 pt-4">
          {!i18n.language?.startsWith("es") && (
            <div className={activeTab === "watch" ? "block" : "hidden"}>
              <WatchTab
                externalSelection={pendingSelection?.type === "video" ? pendingSelection : null}
                onSelectionConsumed={clearSelection}
              />
            </div>
          )}
          <div className={activeTab === "listen" ? "block" : "hidden"}>
            <ListenTab
              externalSelection={pendingSelection?.type === "audio" ? pendingSelection : null}
              onSelectionConsumed={clearSelection}
            />
          </div>
          <div className={activeTab === "read" ? "block" : "hidden"}>
            <ReadTab
              externalSelection={pendingSelection?.type === "devotional" ? pendingSelection : null}
              onSelectionConsumed={clearSelection}
            />
          </div>
          <div className={activeTab === "give" ? "block" : "hidden"}>
            <GiveTab />
          </div>
        </main>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
