import { useState } from "react";
import Icon from "@/components/ui/icon";

const EVENTS = [
  {
    date: "28 апр",
    time: "19:00",
    day: "пн",
    title: "Стратегия роста: как масштабироваться без хаоса",
    speakers: [
      { name: "Анна Волкова", role: "Партнёр McKinsey", avatar: "АВ" },
    ],
    tag: "Стратегия",
    zoom: true,
  },
  {
    date: "5 мая",
    time: "18:30",
    day: "пн",
    title: "Нетворкинг-сессия: знакомства участников",
    speakers: [
      { name: "Команда", role: "Модерация", avatar: "👥" },
    ],
    tag: "Нетворкинг",
    zoom: true,
  },
  {
    date: "12 мая",
    time: "20:00",
    day: "пн",
    title: "Психология переговоров и управление конфликтом",
    speakers: [
      { name: "Михаил Лебедев", role: "Бизнес-психолог", avatar: "МЛ" },
      { name: "Ольга Смит", role: "Медиатор", avatar: "ОС" },
    ],
    tag: "Психология",
    zoom: true,
  },
  {
    date: "19 мая",
    time: "19:00",
    day: "пн",
    title: "Финансовая модель: от идеи до юнит-экономики",
    speakers: [
      { name: "Дмитрий Коваль", role: "CFO / Ментор", avatar: "ДК" },
    ],
    tag: "Финансы",
    zoom: true,
  },
  {
    date: "2 июн",
    time: "18:30",
    day: "пн",
    title: "AI-инструменты для предпринимателей 2025",
    speakers: [
      { name: "Сергей Иванов", role: "AI-эксперт", avatar: "СИ" },
    ],
    tag: "Технологии",
    zoom: true,
  },
];

const TAG_COLORS: Record<string, string> = {
  "Стратегия": "bg-amber-100 text-amber-800",
  "Нетворкинг": "bg-yellow-100 text-yellow-800",
  "Психология": "bg-orange-100 text-orange-800",
  "Финансы": "bg-lime-100 text-lime-800",
  "Технологии": "bg-sky-100 text-sky-800",
};

export default function SchedulePage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-golos tracking-[0.2em] uppercase text-muted-foreground">
            Zoom-встречи
          </span>
          <div className="h-px flex-1 bg-border" />
          <span className="text-gold text-xs">✦</span>
        </div>
        <h1 className="font-cormorant text-4xl font-light text-ink">Расписание</h1>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
        {EVENTS.map((event, i) => (
          <div
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className="rounded-2xl border border-border bg-card overflow-hidden cursor-pointer transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}
          >
            {/* Main row */}
            <div className="flex gap-0">
              {/* Date column */}
              <div className="w-16 shrink-0 flex flex-col items-center justify-center py-4 border-r border-border">
                <span className="font-golos text-[10px] uppercase tracking-widest text-muted-foreground">
                  {event.day}
                </span>
                <span className="font-cormorant text-2xl font-semibold text-gold leading-tight">
                  {event.date.split(" ")[0]}
                </span>
                <span className="font-golos text-[10px] text-muted-foreground">
                  {event.date.split(" ")[1]}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-golos font-semibold text-sm text-ink leading-snug line-clamp-2">
                      {event.title}
                    </p>
                  </div>
                  <Icon
                    name="ChevronDown"
                    size={16}
                    className={`text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300 ${selected === i ? "rotate-180" : ""}`}
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon name="Clock" size={11} />
                    <span className="font-golos text-[11px]">{event.time}</span>
                  </div>
                  <span className={`text-[10px] font-golos font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[event.tag] || "bg-secondary text-foreground"}`}>
                    {event.tag}
                  </span>
                  {event.zoom && (
                    <div className="flex items-center gap-1">
                      <Icon name="Video" size={11} className="text-blue-500" />
                      <span className="font-golos text-[10px] text-blue-500">Zoom</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded */}
            {selected === i && (
              <div className="border-t border-border px-4 py-3 bg-secondary/30 animate-fade-in">
                <p className="font-golos text-xs text-muted-foreground mb-3">Спикеры:</p>
                <div className="space-y-2">
                  {event.speakers.map((sp, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-bronze flex items-center justify-center text-white text-xs font-golos font-semibold shrink-0">
                        {sp.avatar}
                      </div>
                      <div>
                        <p className="font-golos font-semibold text-xs text-ink">{sp.name}</p>
                        <p className="font-golos text-[11px] text-muted-foreground">{sp.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 w-full py-2 rounded-xl text-xs font-golos font-semibold bg-gradient-to-r from-gold to-bronze text-white">
                  Добавить в календарь
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="h-2" />
      </div>
    </div>
  );
}
