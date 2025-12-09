import { useState } from "react";
import { Header } from "@/components/Header";
import { TabNavigation } from "@/components/TabNavigation";
import { WatchTab } from "@/components/tabs/WatchTab";
import { ListenTab } from "@/components/tabs/ListenTab";
import { ReadTab } from "@/components/tabs/ReadTab";
import { GiveTab } from "@/components/tabs/GiveTab";
import { SearchDialog } from "@/components/SearchDialog";
import { Snowfall } from "@/components/Snowfall";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Index = () => {
  const [activeTab, setActiveTab] = useState("read");
  const [searchOpen, setSearchOpen] = useState(false);
  const [christmasMode, setChristmasMode] = useState(false);

return (
  <ErrorBoundary
    fallbackTitle="Page Error"
    fallbackDescription="This page encountered an error. Try navigating to another section."
  >
    <div className="min-h-screen bg-background">
      {christmasMode && <Snowfall />}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <Header
        onSearchClick={() => setSearchOpen(true)}
        christmasMode={christmasMode}
        onChristmasToggle={() => setChristmasMode(!christmasMode)}
      />

      <main className="pb-20 pt-4">
        <div className={activeTab === "watch" ? "block" : "hidden"}>
          <WatchTab />
        </div>
        <div className={activeTab === "listen" ? "block" : "hidden"}>
          <ListenTab />
        </div>
        <div className={activeTab === "read" ? "block" : "hidden"}>
          <ReadTab />
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
