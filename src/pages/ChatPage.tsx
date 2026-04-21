import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const INITIAL_MESSAGES = [
  { id: 1, author: "Анна В.", avatar: "АВ", text: "Всем привет! Кто был на последней встрече — поделитесь инсайтами 🙌", time: "10:14", mine: false },
  { id: 2, author: "Дмитрий К.", avatar: "ДК", text: "Был! Особенно зашла часть про делегирование. Записал себе целый список действий.", time: "10:21", mine: false },
  { id: 3, author: "Ты", avatar: "Я", text: "Согласен, было очень полезно. Особенно пример с командой Михаила.", time: "10:25", mine: true },
  { id: 4, author: "Ольга С.", avatar: "ОС", text: "Девочки, а кто-то пробовал технику deep work по расписанию? Уже 2 неделю — небо и земля по фокусу!", time: "11:03", mine: false },
  { id: 5, author: "Анна В.", avatar: "АВ", text: "Да! Я начала с 90 минут в день без телефона. Сначала сложно, теперь кайф.", time: "11:07", mine: false },
];

interface Message {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
  mine: boolean;
}

interface ChatPageProps {
  isLocked?: boolean;
  onUnlock?: () => void;
}

export default function ChatPage({ isLocked = false, onUnlock }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), author: "Ты", avatar: "Я", text: input.trim(), time, mine: true },
    ]);
    setInput("");
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Icon name="Lock" size={32} className="text-gold" />
        </div>
        <h2 className="font-cormorant text-3xl font-medium text-ink mb-3">
          Закрытый чат
        </h2>
        <p className="font-golos text-sm text-muted-foreground leading-relaxed mb-8 max-w-[260px]">
          Общение доступно только участникам сообщества с активной подпиской.
        </p>
        <button
          onClick={onUnlock}
          className="px-8 py-3 rounded-2xl font-golos font-semibold text-sm text-white"
          style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}
        >
          Выбрать подписку
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-6 pt-10 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-cormorant text-3xl font-medium text-ink">Чат сообщества</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span className="font-golos text-xs text-muted-foreground">47 участников онлайн</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {["АВ", "ДК", "ОС"].map((a, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-gold to-bronze flex items-center justify-center text-white text-[10px] font-golos font-semibold">
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={msg.id} className={`flex gap-2 animate-fade-up ${msg.mine ? "flex-row-reverse" : ""}`}
            style={{ animationDelay: `${i * 0.04}s`, animationFillMode: "both" }}>
            {!msg.mine && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-bronze flex items-center justify-center text-white text-[10px] font-golos font-semibold shrink-0 mt-auto">
                {msg.avatar}
              </div>
            )}
            <div className={`max-w-[72%] ${msg.mine ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {!msg.mine && (
                <span className="font-golos text-[10px] text-muted-foreground px-1">{msg.author}</span>
              )}
              <div className={`px-4 py-2.5 rounded-2xl text-sm font-golos leading-relaxed ${msg.mine ? "msg-bubble-me rounded-tr-sm" : "msg-bubble-other rounded-tl-sm"}`}>
                {msg.text}
              </div>
              <span className={`font-golos text-[10px] text-muted-foreground px-1 ${msg.mine ? "text-right" : ""}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-border">
        <div className="flex gap-2 items-end">
          <div className="flex-1 bg-card border border-border rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Написать сообщение..."
              className="flex-1 bg-transparent font-golos text-sm text-ink placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-opacity"
            style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}
          >
            <Icon name="Send" size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
