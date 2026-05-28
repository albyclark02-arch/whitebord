"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Theme = "light" | "dark";
type View = "landing" | "auth" | "app" | "shared";
type StickyColor = "#FAEEDA" | "#E1F5EE" | "#EEEDFE" | "#FCE8E8" | "#E8F0FC";

interface Board { id: string; name: string; color: string; created_at: string; shared: boolean; share_id: string; }
interface StickyNote { id: string; x: number; y: number; text: string; color: StickyColor; emoji: string; board_id: string; }

const TEMPLATES = [
  { id: "meeting", name: "Team Meeting", icon: "👥", color: "#1D9E75", description: "Agenda, action items, decisions" },
  { id: "brainstorm", name: "Brainstorm", icon: "💡", color: "#7F77DD", description: "Ideas, themes, mind mapping" },
  { id: "sprint", name: "Sprint Planning", icon: "🚀", color: "#EF9F27", description: "Stories, tasks, blockers" },
  { id: "retro", name: "Retrospective", icon: "🔁", color: "#378ADD", description: "What went well, improvements" },
  { id: "blank", name: "Blank Canvas", icon: "✨", color: "#D85A30", description: "Start from scratch" },
];

const BOARD_COLORS = ["#1D9E75","#7F77DD","#EF9F27","#D85A30","#378ADD","#E05C94","#2BBCD4","#8BC34A"];

function LandingPage({ onEnter, onLogin, theme }: { onEnter: () => void; onLogin: () => void; theme: Theme }) {
  const dark = theme === "dark";
  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0F0F0F" : "#ffffff", color: dark ? "#f0f0f0" : "#1a1a1a", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${dark ? "#222" : "#f0f0f0"}` }}>
        <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5 }}>Work<span style={{ color: "#1D9E75" }}>board</span></span>
        <div style={{ flex: 1 }} />
        <button onClick={onLogin} style={{ padding: "8px 16px", background: "transparent", color: dark ? "#aaa" : "#555", border: `1px solid ${dark ? "#333" : "#e0e0e0"}`, borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginRight: 8 }}>Log in</button>
        <button onClick={onEnter} style={{ padding: "8px 20px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Sign up free</button>
      </nav>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, background: "#E1F5EE", color: "#0F6E56", fontSize: 12, fontWeight: 500, marginBottom: 24, fontFamily: "sans-serif" }}>✦ Now in beta</div>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24, letterSpacing: -2 }}>
          Meeting notes that<br /><span style={{ color: "#1D9E75" }}>actually make sense.</span>
        </h1>
        <p style={{ fontSize: 18, color: dark ? "#888" : "#666", maxWidth: 500, lineHeight: 1.7, marginBottom: 40, fontFamily: "sans-serif", fontWeight: 300 }}>
          Workboard is a visual, collaborative workspace for meetings, brainstorming, and planning.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onEnter} style={{ padding: "14px 32px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, cursor: "pointer", fontFamily: "sans-serif", fontWeight: 500 }}>Get started free</button>
          <button onClick={onLogin} style={{ padding: "14px 32px", background: "transparent", border: `1px solid ${dark ? "#333" : "#e0e0e0"}`, borderRadius: 10, fontSize: 15, cursor: "pointer", color: dark ? "#aaa" : "#555", fontFamily: "sans-serif" }}>Log in</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 60, justifyContent: "center" }}>
          {["∞ Infinite canvas","Real-time collab","AI summaries","Templates","Share boards","PDF export"].map(f => (
            <span key={f} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, background: dark ? "#1a1a1a" : "#f5f5f5", border: `1px solid ${dark ? "#2a2a2a" : "#e8e8e8"}`, color: dark ? "#aaa" : "#555", fontFamily: "sans-serif" }}>{f}</span>
          ))}
        </div>
      </div>
      <footer style={{ padding: "20px 40px", borderTop: `1px solid ${dark ? "#1a1a1a" : "#f0f0f0"}`, display: "flex", justifyContent: "space-between", fontSize: 12, color: dark ? "#555" : "#aaa", fontFamily: "sans-serif" }}>
        <span>© 2025 Workboard</span><span>Privacy · Terms</span>
      </footer>
    </div>
  );
}

function AuthPage({ mode, onSuccess, onSwitch, theme }: { mode: "login" | "signup"; onSuccess: () => void; onSwitch: () => void; theme: Theme }) {
  const dark = theme === "dark";
  const bg = dark ? "#0F0F0F" : "#ffffff";
  const bg2 = dark ? "#1a1a1a" : "#f8f8f8";
  const text = dark ? "#f0f0f0" : "#1a1a1a";
  const text2 = dark ? "#888" : "#666";
  const border = dark ? "#222" : "#ebebeb";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSuccess();
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ width: 380, background: bg2, border: `1px solid ${border}`, borderRadius: 16, padding: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: text, marginBottom: 6, textAlign: "center" }}>Work<span style={{ color: "#1D9E75" }}>board</span></h2>
        <p style={{ fontSize: 14, color: text2, textAlign: "center", marginBottom: 28 }}>{mode === "signup" ? "Create your free account" : "Welcome back"}</p>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
          style={{ width: "100%", padding: "10px 14px", border: `1px solid ${border}`, borderRadius: 8, fontSize: 13, background: bg, color: text, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{ width: "100%", padding: "10px 14px", border: `1px solid ${border}`, borderRadius: 8, fontSize: 13, background: bg, color: text, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
        {error && <p style={{ fontSize: 12, color: "#E05C5C", marginBottom: 12 }}>{error}</p>}
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "11px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500, opacity: loading ? 0.7 : 1 }}>
          {loading ? "..." : mode === "signup" ? "Create account" : "Log in"}
        </button>
        <p style={{ fontSize: 12, color: text2, textAlign: "center", marginTop: 16 }}>
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
          <span onClick={onSwitch} style={{ color: "#1D9E75", cursor: "pointer" }}>{mode === "signup" ? "Log in" : "Sign up"}</span>
        </p>
      </div>
    </div>
  );
}

function SharedBoardView({ shareId, theme }: { shareId: string; theme: Theme }) {
  const dark = theme === "dark";
  const bg = dark ? "#0F0F0F" : "#ffffff";
  const bg2 = dark ? "#1a1a1a" : "#f8f8f8";
  const bg3 = dark ? "#141414" : "#f3f3f3";
  const text = dark ? "#f0f0f0" : "#1a1a1a";
  const text2 = dark ? "#888" : "#666";
  const border = dark ? "#222" : "#ebebeb";
  const [board, setBoard] = useState<Board | null>(null);
  const [stickies, setStickies] = useState<StickyNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: b } = await supabase.from("boards").select("*").eq("share_id", shareId).eq("shared", true).single();
      if (b) {
        setBoard(b);
        const { data: s } = await supabase.from("stickies").select("*").eq("board_id", b.id);
        if (s) setStickies(s);
      }
      setLoading(false);
    };
    load();
  }, [shareId]);

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg, fontSize: 14, color: text2, fontFamily: "sans-serif" }}>Loading board...</div>;
  if (!board) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg, fontSize: 14, color: text2, fontFamily: "sans-serif" }}>Board not found or not shared.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: bg, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", height: 48, borderBottom: `1px solid ${border}`, background: bg }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: text, fontFamily: "Georgia, serif" }}>Work<span style={{ color: "#1D9E75" }}>board</span></span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, background: "#E1F5EE", color: "#0F6E56", padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>👁 View only</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: text2, background: bg2, border: `1px solid ${border}`, borderRadius: 8, padding: "4px 10px" }}>{board.name}</span>
      </div>
      <div style={{ flex: 1, position: "relative", background: bg3, backgroundImage: `radial-gradient(circle, ${dark ? "#2a2a2a" : "#d1d5db"} 1px, transparent 1px)`, backgroundSize: "20px 20px" }}>
        {stickies.map(s => (
          <div key={s.id} style={{ position: "absolute", left: s.x, top: s.y, width: 160, padding: 12, borderRadius: 10, background: s.color, color: "#333", fontSize: 12, lineHeight: 1.5, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 10, fontWeight: 500, marginBottom: 6, opacity: 0.7 }}>{s.emoji}</div>
            {s.text}
          </div>
        ))}
        {stickies.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: 14, color: text2 }}>This board is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [theme, setTheme] = useState<Theme>("light");
  const [user, setUser] = useState<any>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState("");
  const [stickies, setStickies] = useState<StickyNote[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardColor, setNewBoardColor] = useState(BOARD_COLORS[0]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [editingSticky, setEditingSticky] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newStickyText, setNewStickyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedBoardId, setSharedBoardId] = useState("");

  const dark = theme === "dark";
  const bg = dark ? "#0F0F0F" : "#ffffff";
  const bg2 = dark ? "#1a1a1a" : "#f8f8f8";
  const bg3 = dark ? "#141414" : "#f3f3f3";
  const text = dark ? "#f0f0f0" : "#1a1a1a";
  const text2 = dark ? "#888" : "#666";
  const text3 = dark ? "#555" : "#aaa";
  const border = dark ? "#222" : "#ebebeb";

  const activeBoard = boards.find(b => b.id === activeBoardId);
  const filteredBoards = boards.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get("share");
    if (shareId) { setSharedBoardId(shareId); setView("shared"); setLoading(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) setView("app");
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) { setView("app"); loadBoards(); }
      else if (!sharedBoardId) setView("landing");
    });
  }, []);

  const loadBoards = async () => {
    const { data } = await supabase.from("boards").select("*").order("created_at", { ascending: false });
    if (data) setBoards(data);
  };

  const loadStickies = async (boardId: string) => {
    const { data } = await supabase.from("stickies").select("*").eq("board_id", boardId);
    if (data) setStickies(data);
  };

  useEffect(() => { if (user) loadBoards(); }, [user]);
  useEffect(() => { if (activeBoardId) loadStickies(activeBoardId); else setStickies([]); }, [activeBoardId]);

  const onMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    const sticky = stickies.find(s => s.id === id);
    if (!sticky) return;
    setDragging(id);
    setDragOffset({ x: e.clientX - sticky.x, y: e.clientY - sticky.y });
    e.preventDefault();
  }, [stickies]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setStickies(prev => prev.map(s => s.id === dragging ? { ...s, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } : s));
  }, [dragging, dragOffset]);

  const onMouseUp = useCallback(async () => {
    if (dragging) {
      const sticky = stickies.find(s => s.id === dragging);
      if (sticky) await supabase.from("stickies").update({ x: sticky.x, y: sticky.y }).eq("id", sticky.id);
    }
    setDragging(null);
  }, [dragging, stickies]);

  const handleAddBoard = async (templateId?: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    const name = newBoardName.trim() || template?.name || "New Board";
    const color = template?.color || newBoardColor;
    const { data } = await supabase.from("boards").insert({ name, color, user_id: user.id }).select().single();
    if (data) { setBoards(prev => [data, ...prev]); setActiveBoardId(data.id); setStickies([]); }
    setNewBoardName(""); setShowTemplates(false);
  };

  const handleAddSticky = async () => {
    if (!newStickyText.trim() || !activeBoardId) return;
    const colors: StickyColor[] = ["#FAEEDA", "#E1F5EE", "#EEEDFE", "#FCE8E8", "#E8F0FC"];
    const emojis = ["💡", "🚩", "❓", "⚠️", "📌"];
    const idx = stickies.length % colors.length;
    const { data } = await supabase.from("stickies").insert({ board_id: activeBoardId, text: newStickyText, color: colors[idx], emoji: emojis[idx], x: 60 + (stickies.length % 4) * 200, y: 80 + Math.floor(stickies.length / 4) * 180 }).select().single();
    if (data) setStickies(prev => [...prev, data]);
    setNewStickyText("");
  };

  const handleToggleShare = async () => {
    if (!activeBoard) return;
    const newShared = !activeBoard.shared;
    await supabase.from("boards").update({ shared: newShared }).eq("id", activeBoard.id);
    setBoards(prev => prev.map(b => b.id === activeBoard.id ? { ...b, shared: newShared } : b));
  };

  const handleCopyLink = () => {
    if (!activeBoard) return;
    const url = `${window.location.origin}?share=${activeBoard.share_id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setBoards([]); setStickies([]); setActiveBoardId(""); setView("landing");
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", fontSize: 14, color: "#aaa", fontFamily: "sans-serif" }}>Loading...</div>;
  if (view === "shared") return <SharedBoardView shareId={sharedBoardId} theme={theme} />;
  if (view === "landing") return <LandingPage onEnter={() => { setAuthMode("signup"); setView("auth"); }} onLogin={() => { setAuthMode("login"); setView("auth"); }} theme={theme} />;
  if (view === "auth") return <AuthPage mode={authMode} onSuccess={() => setView("app")} onSwitch={() => setAuthMode(authMode === "signup" ? "login" : "signup")} theme={theme} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: bg, color: text, fontFamily: "sans-serif" }} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", height: 48, borderBottom: `1px solid ${border}`, background: bg, flexShrink: 0 }}>
        <button onClick={() => setView("landing")} style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3, background: "none", border: "none", cursor: "pointer", color: text, fontFamily: "Georgia, serif" }}>
          Work<span style={{ color: "#1D9E75" }}>board</span>
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: text3 }}>Auto-saved</span>
        {activeBoardId && <button onClick={() => setShowShareModal(true)} style={{ padding: "5px 10px", border: `1px solid ${border}`, borderRadius: 8, fontSize: 12, color: text2, cursor: "pointer", background: "transparent" }}>🔗 Share</button>}
        <button onClick={() => setShowSettings(true)} style={{ padding: "5px 10px", border: `1px solid ${border}`, borderRadius: 8, fontSize: 12, color: text2, cursor: "pointer", background: "transparent" }}>⚙</button>
        <button onClick={() => setShowTemplates(true)} style={{ padding: "5px 12px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>+ Add Board</button>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ width: 220, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", background: bg, flexShrink: 0 }}>
          <div style={{ padding: 12, borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: `1px solid ${border}`, borderRadius: 8, background: bg2 }}>
              <span style={{ fontSize: 12, color: text3 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search boards..." style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: text, width: "100%" }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <p style={{ padding: "10px 12px 4px", fontSize: 10, fontWeight: 500, letterSpacing: "0.6px", color: text3, textTransform: "uppercase" }}>Boards</p>
            {filteredBoards.length === 0 && (
              <div style={{ padding: "20px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: text3, marginBottom: 8 }}>No boards yet</p>
                <button onClick={() => setShowTemplates(true)} style={{ fontSize: 12, color: "#1D9E75", background: "none", border: "none", cursor: "pointer" }}>+ Create your first board</button>
              </div>
            )}
            {filteredBoards.map(b => (
              <div key={b.id} onClick={() => setActiveBoardId(b.id)} style={{ height: 36, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13, cursor: "pointer", background: b.color, color: "#fff", fontWeight: b.id === activeBoardId ? 600 : 400, opacity: b.id === activeBoardId ? 1 : 0.85 }}>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                {b.shared && <span style={{ fontSize: 10, marginLeft: 4 }}>🔗</span>}
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 12px" }}>
            <button onClick={() => setShowTemplates(true)} style={{ width: "100%", padding: "7px 10px", border: `1px dashed ${border}`, borderRadius: 8, fontSize: 12, color: text3, cursor: "pointer", background: "transparent" }}>+ Add Board</button>
          </div>
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: text3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{user?.email}</span>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, background: "#E1F5EE", color: "#0F6E56", padding: "2px 7px", borderRadius: 20, fontWeight: 500 }}>Pro</span>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: bg3, backgroundImage: `radial-gradient(circle, ${dark ? "#2a2a2a" : "#d1d5db"} 1px, transparent 1px)`, backgroundSize: "20px 20px" }}>
          <div style={{ position: "absolute", top: 14, left: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: text2, background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "4px 10px" }}>
              {activeBoard ? activeBoard.name : "Select or create a board →"}
            </span>
          </div>

          {!activeBoardId && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <p style={{ fontSize: 32 }}>🗒️</p>
              <p style={{ fontSize: 15, color: text2, fontWeight: 500 }}>No board selected</p>
              <p style={{ fontSize: 13, color: text3 }}>Create a board to get started</p>
              <button onClick={() => setShowTemplates(true)} style={{ padding: "10px 24px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>+ Create Board</button>
            </div>
          )}

          {activeBoardId && stickies.map(s => (
            <div key={s.id} onMouseDown={e => onMouseDown(e, s.id)} onDoubleClick={() => setEditingSticky(s.id)}
              style={{ position: "absolute", left: s.x, top: s.y, width: 160, padding: 12, borderRadius: 10, background: s.color, color: "#333", fontSize: 12, lineHeight: 1.5, cursor: dragging === s.id ? "grabbing" : "grab", userSelect: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", zIndex: dragging === s.id ? 100 : 1 }}>
              <div style={{ fontSize: 10, fontWeight: 500, marginBottom: 6, opacity: 0.7 }}>{s.emoji}</div>
              {editingSticky === s.id ? (
                <textarea autoFocus defaultValue={s.text}
                  onBlur={async e => {
                    await supabase.from("stickies").update({ text: e.target.value }).eq("id", s.id);
                    setStickies(prev => prev.map(n => n.id === s.id ? { ...n, text: e.target.value } : n));
                    setEditingSticky(null);
                  }}
                  style={{ background: "transparent", border: "none", outline: "none", resize: "none", width: "100%", fontFamily: "sans-serif", fontSize: 12, color: "#333", lineHeight: 1.5 }} />
              ) : s.text}
            </div>
          ))}

          {activeBoardId && (
            <div style={{ position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, background: bg, border: `1px solid ${border}`, borderRadius: 24, padding: "6px 10px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <input value={newStickyText} onChange={e => setNewStickyText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddSticky()}
                placeholder="Add a sticky note and press Enter..."
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: text, width: 260 }} />
              <button onClick={handleAddSticky} style={{ padding: "4px 12px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 16, fontSize: 12, cursor: "pointer" }}>Add</button>
            </div>
          )}

          <div style={{ position: "absolute", bottom: 14, right: 16, display: "flex", alignItems: "center", gap: 6, background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "4px 10px", fontSize: 11, color: text2 }}>
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} style={{ background: "none", border: "none", cursor: "pointer", color: text2, fontSize: 14 }}>−</button>
            <span>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 10))} style={{ background: "none", border: "none", cursor: "pointer", color: text2, fontSize: 14 }}>+</button>
          </div>
        </div>
      </div>

      {showShareModal && activeBoard && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: bg, borderRadius: 16, padding: 28, width: 400, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: text }}>Share Board</h2>
              <button onClick={() => setShowShareModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: text2, fontSize: 18 }}>×</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", border: `1px solid ${border}`, borderRadius: 10, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: text, margin: 0 }}>Public link sharing</p>
                <p style={{ fontSize: 11, color: text3, margin: "2px 0 0" }}>Anyone with the link can view</p>
              </div>
              <div onClick={handleToggleShare} style={{ width: 40, height: 22, borderRadius: 11, background: activeBoard.shared ? "#1D9E75" : border, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: activeBoard.shared ? 21 : 3, transition: "left 0.2s" }} />
              </div>
            </div>
            {activeBoard.shared && (
              <div>
                <p style={{ fontSize: 11, color: text3, marginBottom: 8 }}>Share this link:</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, padding: "8px 12px", background: bg2, border: `1px solid ${border}`, borderRadius: 8, fontSize: 11, color: text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {`${typeof window !== "undefined" ? window.location.origin : ""}?share=${activeBoard.share_id}`}
                  </div>
                  <button onClick={handleCopyLink} style={{ padding: "8px 14px", background: copiedLink ? "#1D9E75" : bg2, color: copiedLink ? "#fff" : text2, border: `1px solid ${border}`, borderRadius: 8, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {copiedLink ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showTemplates && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: bg, borderRadius: 16, padding: 28, width: 480, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: text }}>New Board</h2>
              <button onClick={() => setShowTemplates(false)} style={{ background: "none", border: "none", cursor: "pointer", color: text2, fontSize: 18 }}>×</button>
            </div>
            <input value={newBoardName} onChange={e => setNewBoardName(e.target.value)} placeholder="Board name..."
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${border}`, borderRadius: 8, fontSize: 13, background: bg2, color: text, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
            <p style={{ fontSize: 11, color: text3, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>Choose a template</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => { setNewBoardName(newBoardName || t.name); handleAddBoard(t.id); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: `1px solid ${border}`, borderRadius: 10, cursor: "pointer", background: bg2, textAlign: "left" }}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: text, margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: text3, margin: 0 }}>{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", gap: 6, flex: 1, alignItems: "center" }}>
                {BOARD_COLORS.map(c => (
                  <div key={c} onClick={() => setNewBoardColor(c)} style={{ width: 20, height: 20, borderRadius: "50%", background: c, cursor: "pointer", border: newBoardColor === c ? "2px solid #1a1a1a" : "2px solid transparent" }} />
                ))}
              </div>
              <button onClick={() => handleAddBoard()} style={{ padding: "8px 20px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: bg, borderRadius: 16, padding: 28, width: 360, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: text }}>Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", cursor: "pointer", color: text2, fontSize: 18 }}>×</button>
            </div>
            <p style={{ fontSize: 11, color: text3, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500, marginBottom: 12 }}>Appearance</p>
            <div style={{ display: "flex", background: bg2, borderRadius: 10, padding: 4, marginBottom: 20, border: `1px solid ${border}` }}>
              {(["light", "dark"] as Theme[]).map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 7, fontSize: 13, cursor: "pointer", border: "none", background: theme === t ? bg : "transparent", color: theme === t ? text : text3, fontWeight: theme === t ? 500 : 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {t === "light" ? "☀️" : "🌙"} {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: text3, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500, marginBottom: 12 }}>Account</p>
            <div style={{ padding: "10px 14px", border: `1px solid ${border}`, borderRadius: 8, marginBottom: 8 }}>
              <p style={{ fontSize: 12, color: text2, margin: 0 }}>{user?.email}</p>
            </div>
            <button onClick={handleSignOut} style={{ width: "100%", padding: "10px", border: `1px solid #E05C5C`, borderRadius: 8, background: "transparent", cursor: "pointer", color: "#E05C5C", fontSize: 13 }}>Sign out</button>
            <p style={{ fontSize: 11, color: text3, marginTop: 20, textAlign: "center" }}>Workboard v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
}
