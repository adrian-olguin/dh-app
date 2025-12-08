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
  // const touchStartX = useRef(0);
  // const touchEndX = useRef(0);

  // const tabs = ["watch", "listen", "read", "give"];

  // const handleSwipe = () => {
  //   const swipeThreshold = 50; // Minimum distance for a swipe
  //   const diff = touchStartX.current - touchEndX.current;

  //   if (Math.abs(diff) < swipeThreshold) return;

  //   const currentIndex = tabs.indexOf(activeTab);

  //   if (diff > 0) {
  //     // Swiped left - go to next tab
  //     if (currentIndex < tabs.length - 1) {
  //       setActiveTab(tabs[currentIndex + 1]);
  //     }
  //   } else {
  //     // Swiped right - go to previous tab
  //     if (currentIndex > 0) {
  //       setActiveTab(tabs[currentIndex - 1]);
  //     }
  //   }
  // };

  // const handleTouchStart = (e: React.TouchEvent) => {
  //   touchStartX.current = e.touches[0].clientX;
  // };

  // const handleTouchMove = (e: React.TouchEvent) => {
  //   touchEndX.current = e.touches[0].clientX;
  // };

  // const handleTouchEnd = () => {
  //   handleSwipe();
  // };

  const renderTab = () => {
    switch (activeTab) {
      case "watch":
        return (
          <ErrorBoundary fallbackTitle="Video Error" fallbackDescription="Unable to load videos. Try switching tabs.">
            <div key="watch" className="animate-fade-in">
              <WatchTab />
            </div>
          </ErrorBoundary>
        );
      case "listen":
        return (
          <ErrorBoundary fallbackTitle="Audio Error" fallbackDescription="Unable to load audio content. Try switching tabs.">
            <div key="listen" className="animate-fade-in">
              <ListenTab />
            </div>
          </ErrorBoundary>
        );
      case "read":
        return (
          <ErrorBoundary fallbackTitle="Devotional Error" fallbackDescription="Unable to load devotional. Try switching tabs.">
            <div key="read" className="animate-fade-in">
              <ReadTab />
            </div>
          </ErrorBoundary>
        );
      case "give":
        return (
          <ErrorBoundary fallbackTitle="Giving Error" fallbackDescription="Unable to load giving page. Try switching tabs.">
            <div key="give" className="animate-fade-in">
              <GiveTab />
            </div>
          </ErrorBoundary>
        );
      default:
        return <WatchTab />;
    }
  };

  return (
  <div
    className="min-h-screen bg-muted flex justify-center transition-colors duration-300"
  >
    <div className="w-full max-w-md mx-auto min-h-screen bg-background text-foreground flex flex-col shadow-2xl relative transition-colors duration-300">
      {christmasMode && <Snowfall />}
      <Header
        onSearchClick={() => setSearchOpen(true)}
        christmasMode={christmasMode}
        onChristmasToggle={() => setChristmasMode(!christmasMode)}
      />
      <main
        className="flex-1 pb-24 overflow-y-auto transition-all duration-300"
      >
        {renderTab()}
      </main>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  </div>
);

};

export default Index;
