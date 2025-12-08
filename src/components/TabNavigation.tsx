import { useState } from "react";
import { Play, Headphones, BookOpen, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const { t } = useTranslation();
  
  const tabs = [
    { id: "read", label: t('tabs.read'), icon: BookOpen },
    { id: "listen", label: t('tabs.listen'), icon: Headphones },
    { id: "watch", label: t('tabs.watch'), icon: Play },
    { id: "give", label: t('tabs.give'), icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border/50 z-50 safe-area-inset-bottom shadow-elevated transition-colors duration-300">
      <div className="flex items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2 transition-all duration-300 relative ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-full" />
              )}
              <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon className={`w-6 h-6 transition-transform ${isActive ? "scale-110" : ""}`} />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
