import { useState } from "react";
import Icon from "@/components/ui/icon";
import HomePage from "./HomePage";
import SchedulePage from "./SchedulePage";
import ChatPage from "./ChatPage";
import ProfilePage from "./ProfilePage";
import SupportPage from "./SupportPage";

type Tab = "home" | "schedule" | "chat" | "profile" | "support";

export default function Index() {
  const [tab, setTab] = useState<Tab>("home");
  const [isAuth, setIsAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    if (!hasPaid) {
      setTimeout(() => {
        setHasPaid(true);
      }, 300);
    }
  };

  const NAV: { key: Tab; icon: string; label: string; locked?: boolean }[] = [
    { key: "home", icon: "Sparkles", label: "Главная" },
    { key: "schedule", icon: "CalendarDays", label: "Расписание" },
    { key: "chat", icon: "MessageCircle", label: "Чат", locked: !hasPaid },
    { key: "profile", icon: "User", label: "Кабинет" },
    { key: "support", icon: "HeartHandshake", label: "Забота" },
  ];

  return (
    <div className="grain-overlay flex flex-col h-full max-w-sm mx-auto relative bg-background">
      {/* Status bar imitation */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1 shrink-0">
        <span className="font-golos text-[11px] text-muted-foreground font-medium">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5 items-end h-3">
            {[3, 5, 7, 9].map((h, i) => (
              <div key={i} className="w-1 rounded-sm bg-muted-foreground/60" style={{ height: h }} />
            ))}
          </div>
          <Icon name="Wifi" size={12} className="text-muted-foreground/60" />
          <Icon name="Battery" size={14} className="text-muted-foreground/60" />
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-hidden relative">
        {tab === "home" && <HomePage />}
        {tab === "schedule" && <SchedulePage />}
        {tab === "chat" && (
          <ChatPage
            isLocked={!hasPaid}
            onUnlock={() => setTab("profile")}
          />
        )}
        {tab === "profile" && (
          <ProfilePage
            isAuth={isAuth}
            onLogin={() => setIsAuth(true)}
            selectedPlan={selectedPlan}
            onSelectPlan={handleSelectPlan}
          />
        )}
        {tab === "support" && <SupportPage />}
      </div>

      {/* Bottom tab bar */}
      <div className="shrink-0 tab-bar-blur border-t border-border">
        <div className="flex items-center px-2">
          {NAV.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className="flex-1 flex flex-col items-center gap-1 py-3 relative transition-all duration-200"
              >
                <div className={`relative transition-transform duration-200 ${active ? "scale-110" : ""}`}>
                  <Icon
                    name={item.icon}
                    size={22}
                    className={active ? "text-gold" : "text-muted-foreground"}
                  />
                  {item.locked && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-bronze flex items-center justify-center">
                      <Icon name="Lock" size={7} className="text-white" />
                    </span>
                  )}
                  {item.key === "chat" && hasPaid && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border border-background" />
                  )}
                </div>
                <span
                  className={`font-golos text-[10px] font-medium transition-colors duration-200 ${active ? "text-gold" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
