import { useState } from "react";
import Icon from "@/components/ui/icon";

const FAQ = [
  {
    q: "Как получить доступ к чату?",
    a: "После оформления любой подписки доступ открывается автоматически. Выберите тариф в Личном кабинете и оплатите — чат станет доступен мгновенно.",
  },
  {
    q: "Можно ли сменить тариф?",
    a: "Да, вы можете повысить или понизить тариф в любое время. Изменения вступают в силу со следующего платёжного периода.",
  },
  {
    q: "Записи встреч доступны после эфира?",
    a: "Да, для тарифов Стандарт и Премиум записи появляются в течение 24 часов после встречи.",
  },
  {
    q: "Как войти с нового устройства?",
    a: "При входе с нового устройства система попросит подтвердить личность по SMS. Это защищает ваш аккаунт.",
  },
  {
    q: "Как отменить подписку?",
    a: "Напишите нам через форму обратной связи или в чат поддержки. Мы отменим подписку в течение рабочего дня.",
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-golos tracking-[0.2em] uppercase text-muted-foreground">Помощь</span>
          <div className="h-px flex-1 bg-border" />
          <span className="text-gold text-xs">✦</span>
        </div>
        <h1 className="font-cormorant text-4xl font-light text-ink">Служба заботы</h1>
        <p className="font-golos text-sm text-muted-foreground mt-1">Ответим в течение 2 часов</p>
      </div>

      {/* Quick contacts */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "MessageCircle", label: "Telegram", sub: "@support", color: "text-sky-500" },
            { icon: "Mail", label: "Email", sub: "hi@community.ru", color: "text-gold" },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-2">
              <Icon name={c.icon} size={20} className={c.color} />
              <div>
                <p className="font-golos font-semibold text-sm text-ink">{c.label}</p>
                <p className="font-golos text-xs text-muted-foreground">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div className="px-6 mb-6">
        <h2 className="font-cormorant text-2xl font-medium text-ink mb-4">Написать нам</h2>
        {sent ? (
          <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <p className="font-golos font-semibold text-sm text-green-800">Сообщение отправлено!</p>
            <p className="font-golos text-xs text-green-600 mt-1">Ответим вам в ближайшее время</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="font-golos text-xs text-muted-foreground mb-1.5 block">Ваше имя</label>
              <input
                placeholder="Как вас зовут?"
                className="w-full bg-card border border-border rounded-2xl px-4 py-3 font-golos text-sm text-ink placeholder:text-muted-foreground outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="font-golos text-xs text-muted-foreground mb-1.5 block">Тема</label>
              <select className="w-full bg-card border border-border rounded-2xl px-4 py-3 font-golos text-sm text-ink outline-none focus:border-gold transition-colors appearance-none">
                <option>Вопрос по подписке</option>
                <option>Технические проблемы</option>
                <option>Вопрос по встречам</option>
                <option>Другое</option>
              </select>
            </div>
            <div>
              <label className="font-golos text-xs text-muted-foreground mb-1.5 block">Сообщение</label>
              <textarea
                placeholder="Опишите ваш вопрос..."
                rows={4}
                className="w-full bg-card border border-border rounded-2xl px-4 py-3 font-golos text-sm text-ink placeholder:text-muted-foreground outline-none focus:border-gold transition-colors resize-none"
              />
            </div>
            <button
              onClick={() => setSent(true)}
              className="w-full py-3 rounded-2xl font-golos font-semibold text-sm text-white"
              style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}
            >
              Отправить
            </button>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="px-6 mb-8">
        <h2 className="font-cormorant text-2xl font-medium text-ink mb-4">Частые вопросы</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <span className="font-golos font-medium text-sm text-ink flex-1 pr-2">{item.q}</span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 animate-fade-in">
                  <p className="font-golos text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
