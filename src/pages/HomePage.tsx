import Icon from "@/components/ui/icon";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-12 pb-10">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(43,75%,49%) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-golos tracking-[0.2em] uppercase text-muted-foreground">
              Закрытое сообщество
            </span>
            <div className="h-px flex-1 bg-border" />
            <span className="text-gold text-xs">✦</span>
          </div>
          <h1 className="font-cormorant text-5xl leading-[1.1] font-light text-ink mb-4">
            Место, где
            <br />
            <span className="gold-shimmer font-semibold italic">рождаются</span>
            <br />
            идеи
          </h1>
          <p className="font-golos text-sm text-muted-foreground leading-relaxed max-w-[280px]">
            Сообщество предпринимателей и экспертов, которые растут вместе — через диалог, знания и живые встречи.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 mx-6 mb-8 rounded-2xl overflow-hidden border border-border bg-card">
        {[
          { value: "240+", label: "участников" },
          { value: "48", label: "встреч в год" },
          { value: "3", label: "тарифа" },
        ].map((s, i) => (
          <div
            key={i}
            className={`py-4 px-3 text-center ${i < 2 ? "border-r border-border" : ""}`}
          >
            <div className="font-cormorant text-2xl font-semibold text-gold">{s.value}</div>
            <div className="font-golos text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* About section */}
      <div className="px-6 mb-8">
        <h2 className="font-cormorant text-2xl font-medium text-ink mb-4">О сообществе</h2>
        <div className="space-y-3">
          {[
            {
              icon: "Flame",
              title: "Живое общение",
              desc: "Закрытый чат только для участников — без спама, только по делу и по душе.",
            },
            {
              icon: "Video",
              title: "Zoom-встречи",
              desc: "Регулярные сессии с приглашёнными экспертами и разборы реальных кейсов.",
            },
            {
              icon: "Star",
              title: "Рост и нетворкинг",
              desc: "Связи, которые открывают двери. Окружение, которое тянет вверх.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-2xl bg-card border border-border animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Icon name={item.icon} size={18} className="text-gold" />
              </div>
              <div>
                <div className="font-golos font-semibold text-sm text-ink mb-1">{item.title}</div>
                <div className="font-golos text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 mb-8">
        <div className="relative rounded-3xl overflow-hidden p-6 text-white"
          style={{ background: "linear-gradient(135deg, hsl(43,75%,42%) 0%, hsl(30,55%,35%) 100%)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
          <p className="font-cormorant text-2xl font-medium mb-2 leading-tight">
            Готов стать частью?
          </p>
          <p className="font-golos text-xs opacity-80 mb-4 leading-relaxed">
            Выбери подписку и получи доступ к закрытому чату и встречам.
          </p>
          <button className="bg-white text-bronze font-golos font-semibold text-sm px-5 py-2.5 rounded-xl">
            Выбрать тариф
          </button>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
