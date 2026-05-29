import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/fa187db8-7240-458b-9b21-eeff4124fb82";

type Tab = "stats" | "links" | "chat" | "payments" | "blocked";

interface Link { id: number; title: string; url: string; description: string; category: string; is_active: boolean; sort_order: number; }
interface Message { id: number; author_name: string; author_avatar: string; text: string; is_deleted: boolean; created_at: string; }
interface Payment { id: number; user_name: string; user_email: string; plan_name: string; amount: number; status: string; payment_date: string; refunded: boolean; }
interface Blocked { id: number; user_identifier: string; reason: string; blocked_at: string; }
interface Stats { messages: number; links: number; payments: number; revenue: number; blocked: number; }

function api(token: string, path: string, method = "GET", body?: object) {
  return fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("stats");

  const [stats, setStats] = useState<Stats | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [blocked, setBlocked] = useState<Blocked[]>([]);

  const [newLink, setNewLink] = useState({ title: "", url: "", description: "", category: "general" });
  const [editLink, setEditLink] = useState<Link | null>(null);
  const [blockForm, setBlockForm] = useState({ user_identifier: "", reason: "" });
  const [showBlockForm, setShowBlockForm] = useState(false);

  const isAuth = !!token;

  async function login() {
    setLoading(true);
    setLoginError("");
    const res = await fetch(`${API}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", ...loginData }),
    }).then(r => r.json());
    setLoading(false);
    if (res.token) {
      localStorage.setItem("admin_token", res.token);
      setToken(res.token);
    } else {
      setLoginError(res.error || "Ошибка входа");
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken("");
  }

  useEffect(() => {
    if (!isAuth) return;
    if (tab === "stats") api(token, "/stats").then(setStats);
    if (tab === "links") api(token, "/links").then(setLinks);
    if (tab === "chat") api(token, "/chat").then(setMessages);
    if (tab === "payments") api(token, "/payments").then(setPayments);
    if (tab === "blocked") api(token, "/blocked").then(setBlocked);
  }, [tab, isAuth]);

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--bronze))] flex items-center justify-center mx-auto mb-4">
              <Icon name="ShieldCheck" size={28} className="text-white" />
            </div>
            <h1 className="font-cormorant text-3xl font-semibold text-[hsl(var(--ink))]">Администратор</h1>
            <p className="font-golos text-sm text-[hsl(var(--muted-foreground))] mt-1">Управление сообществом</p>
          </div>
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl p-6 space-y-4">
            <div>
              <label className="font-golos text-xs text-[hsl(var(--muted-foreground))] mb-1.5 block">Логин</label>
              <input
                value={loginData.username}
                onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))}
                placeholder="admin"
                className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-2xl px-4 py-3 font-golos text-sm text-[hsl(var(--ink))] outline-none focus:border-[hsl(var(--gold))] transition-colors"
              />
            </div>
            <div>
              <label className="font-golos text-xs text-[hsl(var(--muted-foreground))] mb-1.5 block">Пароль</label>
              <input
                type="password"
                value={loginData.password}
                onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                placeholder="••••••••"
                className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-2xl px-4 py-3 font-golos text-sm text-[hsl(var(--ink))] outline-none focus:border-[hsl(var(--gold))] transition-colors"
              />
            </div>
            {loginError && <p className="font-golos text-xs text-red-500">{loginError}</p>}
            <button
              onClick={login}
              disabled={loading}
              className="w-full py-3 rounded-2xl font-golos font-semibold text-sm text-white transition-opacity disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}
            >
              {loading ? "Входим..." : "Войти"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const TABS: { key: Tab; icon: string; label: string }[] = [
    { key: "stats", icon: "BarChart2", label: "Сводка" },
    { key: "links", icon: "Link2", label: "Ссылки" },
    { key: "chat", icon: "MessageSquare", label: "Чат" },
    { key: "payments", icon: "CreditCard", label: "Платежи" },
    { key: "blocked", icon: "Ban", label: "Блок" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--bronze))] flex items-center justify-center">
            <Icon name="ShieldCheck" size={16} className="text-white" />
          </div>
          <span className="font-cormorant text-xl font-semibold text-[hsl(var(--ink))]">Панель управления</span>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 font-golos text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--ink))] transition-colors">
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </div>

      {/* Nav */}
      <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-4 flex gap-1 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 font-golos text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? "border-[hsl(var(--gold))] text-[hsl(var(--ink))]"
                : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--ink))]"
            }`}
          >
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* STATS */}
        {tab === "stats" && (
          <div className="space-y-4">
            <h2 className="font-cormorant text-2xl font-semibold text-[hsl(var(--ink))]">Общая сводка</h2>
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Сообщений", value: stats.messages, icon: "MessageSquare", color: "text-blue-500" },
                  { label: "Ссылок", value: stats.links, icon: "Link2", color: "text-green-500" },
                  { label: "Платежей", value: stats.payments, icon: "CreditCard", color: "text-[hsl(var(--gold))]" },
                  { label: "Заблокировано", value: stats.blocked, icon: "Ban", color: "text-red-500" },
                ].map((s, i) => (
                  <div key={i} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4">
                    <Icon name={s.icon} size={20} className={s.color} />
                    <p className="font-cormorant text-3xl font-semibold text-[hsl(var(--ink))] mt-2">{s.value}</p>
                    <p className="font-golos text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-golos text-sm text-[hsl(var(--muted-foreground))]">Загрузка...</div>
            )}
            {stats && (
              <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-5">
                <p className="font-golos text-xs text-[hsl(var(--muted-foreground))] mb-1">Общий доход</p>
                <p className="font-cormorant text-4xl font-semibold text-[hsl(var(--ink))]">
                  {Number(stats.revenue).toLocaleString("ru-RU")} ₽
                </p>
              </div>
            )}
          </div>
        )}

        {/* LINKS */}
        {tab === "links" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-cormorant text-2xl font-semibold text-[hsl(var(--ink))]">Ссылки</h2>
            </div>

            {/* Add form */}
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 space-y-3">
              <p className="font-golos text-sm font-semibold text-[hsl(var(--ink))]">Добавить ссылку</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={newLink.title} onChange={e => setNewLink(p => ({ ...p, title: e.target.value }))} placeholder="Название" className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none focus:border-[hsl(var(--gold))]" />
                <input value={newLink.url} onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))} placeholder="https://..." className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none focus:border-[hsl(var(--gold))]" />
                <input value={newLink.description} onChange={e => setNewLink(p => ({ ...p, description: e.target.value }))} placeholder="Описание (необязательно)" className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none focus:border-[hsl(var(--gold))]" />
                <input value={newLink.category} onChange={e => setNewLink(p => ({ ...p, category: e.target.value }))} placeholder="Категория" className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none focus:border-[hsl(var(--gold))]" />
              </div>
              <button
                onClick={async () => {
                  if (!newLink.title || !newLink.url) return;
                  const created = await api(token, "/links", "POST", newLink);
                  setLinks(p => [created, ...p]);
                  setNewLink({ title: "", url: "", description: "", category: "general" });
                }}
                className="px-5 py-2 rounded-xl font-golos text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}
              >
                Добавить
              </button>
            </div>

            {/* List */}
            <div className="space-y-2">
              {links.map(link => (
                <div key={link.id} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4">
                  {editLink?.id === link.id ? (
                    <div className="space-y-2">
                      <input value={editLink.title} onChange={e => setEditLink(p => p ? { ...p, title: e.target.value } : p)} className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none" />
                      <input value={editLink.url} onChange={e => setEditLink(p => p ? { ...p, url: e.target.value } : p)} className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none" />
                      <input value={editLink.description} onChange={e => setEditLink(p => p ? { ...p, description: e.target.value } : p)} className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none" />
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          const updated = await api(token, `/links/${editLink.id}`, "PUT", editLink);
                          setLinks(p => p.map(l => l.id === updated.id ? updated : l));
                          setEditLink(null);
                        }} className="px-4 py-1.5 rounded-xl font-golos text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, hsl(43,75%,49%) 0%, hsl(30,55%,40%) 100%)" }}>Сохранить</button>
                        <button onClick={() => setEditLink(null)} className="px-4 py-1.5 rounded-xl font-golos text-sm text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]">Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-golos font-semibold text-sm text-[hsl(var(--ink))] truncate">{link.title}</p>
                          <span className="text-[10px] font-golos px-2 py-0.5 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]">{link.category}</span>
                        </div>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-golos text-xs text-[hsl(var(--gold))] truncate block">{link.url}</a>
                        {link.description && <p className="font-golos text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{link.description}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setEditLink(link)} className="w-8 h-8 rounded-xl bg-[hsl(var(--secondary))] flex items-center justify-center">
                          <Icon name="Pencil" size={14} className="text-[hsl(var(--muted-foreground))]" />
                        </button>
                        <button onClick={async () => {
                          await api(token, `/links/${link.id}`, "DELETE");
                          setLinks(p => p.filter(l => l.id !== link.id));
                        }} className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                          <Icon name="Trash2" size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {links.length === 0 && <p className="font-golos text-sm text-[hsl(var(--muted-foreground))] text-center py-8">Ссылок пока нет</p>}
            </div>
          </div>
        )}

        {/* CHAT */}
        {tab === "chat" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-cormorant text-2xl font-semibold text-[hsl(var(--ink))]">Модерация чата</h2>
              <button onClick={() => setShowBlockForm(!showBlockForm)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-golos text-sm font-medium border border-[hsl(var(--border))] text-[hsl(var(--ink))]">
                <Icon name="Ban" size={14} />
                Заблокировать
              </button>
            </div>

            {showBlockForm && (
              <div className="bg-[hsl(var(--card))] border border-red-200 rounded-2xl p-4 space-y-3">
                <p className="font-golos text-sm font-semibold text-[hsl(var(--ink))]">Заблокировать пользователя</p>
                <input value={blockForm.user_identifier} onChange={e => setBlockForm(p => ({ ...p, user_identifier: e.target.value }))} placeholder="Email или имя пользователя" className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none" />
                <input value={blockForm.reason} onChange={e => setBlockForm(p => ({ ...p, reason: e.target.value }))} placeholder="Причина блокировки" className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl px-3 py-2 font-golos text-sm text-[hsl(var(--ink))] outline-none" />
                <button onClick={async () => {
                  if (!blockForm.user_identifier) return;
                  await api(token, "/chat/block", "POST", blockForm);
                  setBlockForm({ user_identifier: "", reason: "" });
                  setShowBlockForm(false);
                }} className="px-5 py-2 rounded-xl font-golos text-sm font-semibold text-white bg-red-500">
                  Заблокировать
                </button>
              </div>
            )}

            <div className="space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className={`bg-[hsl(var(--card))] border rounded-2xl p-4 flex gap-3 ${msg.is_deleted ? "opacity-40 border-red-200" : "border-[hsl(var(--border))]"}`}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--bronze))] flex items-center justify-center text-white text-xs font-golos font-semibold shrink-0">
                    {msg.author_avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-golos text-xs font-semibold text-[hsl(var(--ink))]">{msg.author_name}</span>
                      <span className="font-golos text-[10px] text-[hsl(var(--muted-foreground))]">{new Date(msg.created_at).toLocaleString("ru-RU")}</span>
                      {msg.is_deleted && <span className="text-[10px] font-golos text-red-400 font-medium">удалено</span>}
                    </div>
                    <p className="font-golos text-sm text-[hsl(var(--ink))] mt-0.5">{msg.text}</p>
                  </div>
                  {!msg.is_deleted && (
                    <button onClick={async () => {
                      await api(token, `/chat/delete/${msg.id}`, "POST");
                      setMessages(p => p.map(m => m.id === msg.id ? { ...m, is_deleted: true } : m));
                    }} className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <Icon name="Trash2" size={14} className="text-red-500" />
                    </button>
                  )}
                </div>
              ))}
              {messages.length === 0 && <p className="font-golos text-sm text-[hsl(var(--muted-foreground))] text-center py-8">Сообщений нет</p>}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {tab === "payments" && (
          <div className="space-y-4">
            <h2 className="font-cormorant text-2xl font-semibold text-[hsl(var(--ink))]">Платежи</h2>
            <div className="space-y-2">
              {payments.map(p => (
                <div key={p.id} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${p.refunded ? "bg-orange-50" : "bg-green-50"}`}>
                    <Icon name={p.refunded ? "RotateCcw" : "CheckCircle"} size={18} className={p.refunded ? "text-orange-400" : "text-green-500"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-golos font-semibold text-sm text-[hsl(var(--ink))]">{p.user_name}</p>
                    <p className="font-golos text-xs text-[hsl(var(--muted-foreground))]">{p.plan_name} · {new Date(p.payment_date).toLocaleDateString("ru-RU")}</p>
                    {p.user_email && <p className="font-golos text-xs text-[hsl(var(--muted-foreground))]">{p.user_email}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-golos font-semibold text-sm text-[hsl(var(--ink))]">{p.amount.toLocaleString("ru-RU")} ₽</p>
                    <p className={`font-golos text-xs ${p.refunded ? "text-orange-400" : "text-green-500"}`}>{p.refunded ? "возврат" : "оплачено"}</p>
                  </div>
                  {!p.refunded && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Сделать возврат ${p.amount.toLocaleString("ru-RU")} ₽ для ${p.user_name}?`)) return;
                        const updated = await api(token, `/payments/${p.id}/refund`, "POST");
                        setPayments(prev => prev.map(x => x.id === updated.id ? updated : x));
                      }}
                      className="px-3 py-1.5 rounded-xl font-golos text-xs font-medium border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      Возврат
                    </button>
                  )}
                </div>
              ))}
              {payments.length === 0 && <p className="font-golos text-sm text-[hsl(var(--muted-foreground))] text-center py-8">Платежей нет</p>}
            </div>
          </div>
        )}

        {/* BLOCKED */}
        {tab === "blocked" && (
          <div className="space-y-4">
            <h2 className="font-cormorant text-2xl font-semibold text-[hsl(var(--ink))]">Заблокированные</h2>
            <div className="space-y-2">
              {blocked.map(b => (
                <div key={b.id} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <Icon name="Ban" size={18} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-golos font-semibold text-sm text-[hsl(var(--ink))]">{b.user_identifier}</p>
                    {b.reason && <p className="font-golos text-xs text-[hsl(var(--muted-foreground))]">{b.reason}</p>}
                    <p className="font-golos text-xs text-[hsl(var(--muted-foreground))]">{new Date(b.blocked_at).toLocaleDateString("ru-RU")}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await api(token, `/blocked/unblock/${b.id}`, "POST");
                      setBlocked(prev => prev.filter(x => x.id !== b.id));
                    }}
                    className="px-3 py-1.5 rounded-xl font-golos text-xs font-medium border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--ink))] transition-colors"
                  >
                    Разблокировать
                  </button>
                </div>
              ))}
              {blocked.length === 0 && <p className="font-golos text-sm text-[hsl(var(--muted-foreground))] text-center py-8">Заблокированных нет</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
