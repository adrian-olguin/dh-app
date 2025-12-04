import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complete after fade animation finishes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-hero flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 bg-white/30 blur-3xl rounded-full animate-glow" />
          <img
            src="/images/daily-hope-logo.png"
            alt="Daily Hope"
            className="relative w-36 h-36 object-contain mb-8 drop-shadow-2xl"
          />
        </div>
      </div>
      
      <h1 className="text-white text-4xl font-display font-bold mb-3 animate-fade-in drop-shadow-lg">
        Daily Hope
      </h1>
      
      <p className="text-white/95 text-xl font-medium animate-fade-in" style={{ animationDelay: "0.2s" }}>
        with Pastor Rick
      </p>

      {/* Loading indicator */}
      <div className="mt-16 flex gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-glow" style={{ animationDelay: "0s" }} />
        <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-glow" style={{ animationDelay: "0.2s" }} />
        <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-glow" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
};
