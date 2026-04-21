import { useState } from "react";
import Icon from "@/components/ui/icon";

const PLANS = [
  {
    id: "basic",
    name: "Базовый",
    price: "2 900",
    period: "мес",
    features: ["Доступ к чату", "Расписание встреч", "1 Zoom в месяц"],
    accent: false,
  },
  {
    id: "standard",
    name: "Стандарт",
    price: "5 900",
    period: "мес",
    features: ["Всё из Базового", "Все Zoom-встречи", "Записи встреч", "Нетворкинг-сессии"],
    accent: true,
    badge: "Популярный",
  },
  {
    id: "premium",
    name: "Премиум",
    price: "12 900",
    period: "мес",
    features: ["Всё из Стандарта", "Менторство 1×1", "Приоритетная поддержка", "VIP-встречи"],
    accent: false,
  },
];

interface ProfilePageProps {
  isAuth: boolean;
  onLogin: () => void;
  selectedPlan: string | null;
  onSelectPlan: (plan: string) => void;
}

export default function ProfilePage({ isAuth, onLogin, selectedPlan, onSelectPlan }: ProfilePageProps) {
  const [tab, setTab] = useState<"profile" | "plans" | "payments">("plans");

  if (!isAuth) {
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-10 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-golos tracking-[0.2em] uppercase text-muted-foreground">Вход</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <h1 className="font-cormorant text-4xl font-light text-ink">Личный кабинет</h1>
        </div>

        {/* Login form */}
        <div className="px-6 space-y-3 mb-6">
          <div>
            <label className="font-golos text-xs text-muted-foreground mb-1.5 block">Телефон или email</label>
            <input
              placeholder="+7 (___) ___-__-__"
              className="w-full bg-card border border-border rounded-2xl px-4 py-3 font-golos text-sm text-ink placeholder:text-muted-foreground outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="font-golos text-xs text-muted-foreground mb-1.5 block">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-card border border-border rounded-2xl px-4 py-3 font-golos text-sm text-ink placeholder:text-muted-foreground outline-none focus:border-gold transition-colors"
            />
          </div>
          <button
            onClick={onLogin}
            className="w-full py-3 rounded-2xl font-golos font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}
          >
            Войти
          </button>
          <div className="text-center">
            <span className="font-golos text-xs text-muted-foreground">Нет аккаунта? </span>
            <button className="font-golos text-xs text-gold font-semibold">Зарегистрироваться</button>
          </div>
        </div>

        <div className="px-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-golos text-xs text-muted-foreground">или</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>

        <div className="px-6 mb-8">
          <button className="w-full py-3 rounded-2xl font-golos font-medium text-sm border border-border bg-card flex items-center justify-center gap-2">
            <Icon name="Smartphone" size={16} className="text-gold" />
            Войти по SMS-коду
          </button>
        </div>

        {/* Plans preview */}
        <div className="px-6 mb-4">
          <p className="font-cormorant text-2xl font-medium text-ink mb-4">Тарифы</p>
        </div>
        <PlanCards plans={PLANS} selectedPlan={selectedPlan} onSelectPlan={onSelectPlan} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Profile header */}
      <div className="px-6 pt-10 pb-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-bronze flex items-center justify-center text-white text-xl font-cormorant font-semibold">
            МА
          </div>
          <div className="flex-1">
            <h2 className="font-cormorant text-2xl font-medium text-ink">Мария Александрова</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span className="font-golos text-xs text-muted-foreground">Стандарт · до 1 июня</span>
            </div>
          </div>
          <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <Icon name="Settings" size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-secondary rounded-2xl p-1 mb-6">
          {[
            { key: "plans", label: "Тарифы" },
            { key: "payments", label: "Оплаты" },
            { key: "profile", label: "Профиль" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-2 rounded-xl font-golos text-xs font-medium transition-all duration-200 ${tab === t.key ? "bg-white text-ink shadow-sm" : "text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "plans" && (
          <div className="px-6">
            <PlanCards plans={PLANS} selectedPlan={selectedPlan} onSelectPlan={onSelectPlan} />
          </div>
        )}

        {tab === "payments" && (
          <div className="px-6 space-y-3 pb-6">
            {[
              { date: "1 апр 2026", plan: "Стандарт", amount: "5 900 ₽", status: "оплачено" },
              { date: "1 мар 2026", plan: "Стандарт", amount: "5 900 ₽", status: "оплачено" },
              { date: "1 фев 2026", plan: "Базовый", amount: "2 900 ₽", status: "оплачено" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Icon name="CheckCircle" size={18} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-golos font-semibold text-sm text-ink">{p.plan}</p>
                  <p className="font-golos text-xs text-muted-foreground">{p.date}</p>
                </div>
                <span className="font-golos font-semibold text-sm text-ink">{p.amount}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "profile" && (
          <div className="px-6 space-y-4 pb-6">
            {[
              { label: "Имя", value: "Мария Александрова" },
              { label: "Телефон", value: "+7 (999) 123-45-67" },
              { label: "Email", value: "maria@example.com" },
            ].map((f, i) => (
              <div key={i}>
                <label className="font-golos text-xs text-muted-foreground mb-1.5 block">{f.label}</label>
                <input
                  defaultValue={f.value}
                  className="w-full bg-card border border-border rounded-2xl px-4 py-3 font-golos text-sm text-ink outline-none focus:border-gold transition-colors"
                />
              </div>
            ))}
            <button className="w-full py-3 rounded-2xl font-golos font-semibold text-sm text-white mt-2"
              style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}>
              Сохранить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCards({ plans, selectedPlan, onSelectPlan }: {
  plans: typeof PLANS;
  selectedPlan: string | null;
  onSelectPlan: (id: string) => void;
}) {
  return (
    <div className="space-y-3 pb-6">
      {plans.map((plan, i) => (
        <div
          key={plan.id}
          onClick={() => onSelectPlan(plan.id)}
          className={`relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 animate-fade-up ${
            selectedPlan === plan.id
              ? "border-gold shadow-md shadow-gold/10"
              : "border-border bg-card"
          }`}
          style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
        >
          {plan.accent && (
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }} />
          )}
          {plan.badge && (
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-golos font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}>
                {plan.badge}
              </span>
            </div>
          )}
          <div className="p-5">
            <div className="flex items-end gap-1 mb-3">
              <span className="font-cormorant text-3xl font-semibold text-ink">{plan.price} ₽</span>
              <span className="font-golos text-xs text-muted-foreground mb-1">/{plan.period}</span>
            </div>
            <p className="font-golos font-semibold text-sm text-ink mb-3">{plan.name}</p>
            <ul className="space-y-1.5">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2">
                  <Icon name="Check" size={13} className="text-gold shrink-0" />
                  <span className="font-golos text-xs text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            {selectedPlan === plan.id && (
              <button className="mt-4 w-full py-2.5 rounded-xl font-golos font-semibold text-xs text-white"
                style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}>
                Оплатить — {plan.price} ₽
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
