"use client";
import { useState, useRef, useCallback } from "react";

type Theme = "light" | "dark";
type View = "landing" | "app";
type StickyColor = "#FAEEDA" | "#E1F5EE" | "#EEEDFE" | "#FCE8E8" | "#E8F0FC";

interface Bord { id: string; name: string; color: string; createdAt: Date; }
interface StickyNote { id: string; x: number; y: number; text: string; color: StickyColor; emoji: string; }
interface CheckItem { id: string; text: string; done: boolean; }

const TEMPLATES = [
  { id: "meeting", name: "Team Meeting", icon: "👥", color: "#1D9E75", description: "Agenda, action items, decisions" },
  { id: "brainstorm", name: "Brainstorm", icon: "💡", color: "#7F77DD", description: "Ideas, themes, mind mapping" },
  { id: "sprint", name: "Sprint Planning", icon: "🚀", color: "#EF9F27", description: "Stories, tasks, blockers" },
  { id: "retro", name: "Retrospective", icon: "🔁", color: "#378ADD", description: "What went well, improvements" },
  { id: "blank", name: "Blank Canvas", icon: "✨", color: "#D85A30", description: "Start from scratch" },
];

const BORD_COLORS = ["#1D9E75","#7F77DD","#EF9F27","#D85A30","#378ADD","#E05C94","#2BBCD4","#8BC34A"];

function LandingPage({ onEnter, theme }: { onEnter: () => void; theme: Theme }) {
  const dark = theme === "dark";
  return (
    <div style={{ minHeight: "100vh", background: dark ? "#0F0F0F" : "#ffffff", color: dark ? "#f0f0f0" : "#1a1a1a", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${dark ? "#222" : "#f0f0f0"}` }}>
        <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.5 }}>White<span style={{ color: "#1D9E75" }}>bord</span></span>
        <div style={{ flex: 1 }} />
        <button onClick={onEnter} style={{ padding: "8px 20px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Open App →</button>
      </nav>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, background: "#E1F5EE", color: "#0F6E56", fontSize: 12, fontWeight: 500, marginBottom: 24, fontFamily: "sans-serif" }}>✦ Now in beta</div>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24, letterSpacing: -2 }}>
          Meeting notes that<br /><span style={{ color: "#1D9E75" }}>actually make sense.</span>
        </h1>
        <p style={{ fontSize: 18, color: dark ? "#888" : "#666", maxWidth: 500, lineHeight: 1.7, marginBottom: 40, fontFamily: "sans-serif", fontWeight: 300 }}>
          Workboard is a visual, collaborative workspace for meetings, brainstorming, and planning. Fast, minimal, and built around how you actually think.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onEnter} style={{ padding: "14px 32px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, cursor: "pointer", fontFamily: "sans-serif", fontWeight: 500 }}>Get started free</button>
          <button style={{ padding: "14px 32px", background: "transparent", border: `1px solid ${dark ? "#333" : "#e0e0e0"}`, borderRadius: 10, fontSize: 15, cursor: "pointer", color: dark ? "#aaa" : "#555", fontFamily: "sans-serif" }}>Watch demo</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 60, justifyContent: "center" }}>
          {["∞ Infinite canvas","Real-time collab","AI summaries","Templates","Offline support","PDF export"].map(f => (
            <span key={f} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, background: dark ? "#1a1a1a" : "#f5f5f5", border: `1px solid ${dark ? "#2a2a2a" : "#e8e8e8"}`, color: dark ? "#aaa" : "#555", fontFamily: "sans-serif" }}>{f}</span>
          ))}
        </div>
        <div style={{ marginTop: 60, width: "100%", maxWidth: 700, borderRadius: 16, border: `1px solid ${dark ? "#222" : "#e8e8e8"}`, background: dark ? "#141414" : "#fafafa", padding: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[{ color: "#FAEEDA", text: "OAuth migration", emoji: "💡" }, { color: "#E1F5EE", text: "Mobile beta Aug 15", emoji: "🚩" }, { color: "#EEEDFE", text: "Pricing decision", emoji: "❓" }, { color: "#FCE8E8", text: "Load test needed", emoji: "⚠️" }].map((s, i) => (
            <div key={i} style={{ background: s.color, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#333", flex: "1 1 140px", minWidth: 120 }}>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{s.emoji}</div>{s.text}
            </div>
          ))}
        </div>
      </div>
      <footer style={{ padding: "20px 40px", borderTop: `1px solid ${dark ? "#1a1a1a" : "#f0f0f0"}`, display: "flex", justifyContent: "space-between", fontSize: 12, color: dark ? "#555" : "#aaa", fontFamily: "sans-serif" }}>
        <span>© 2025 Workboard</span><span>Privacy · Terms</span>
      </footer>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [theme, setTheme] = useState<Theme>("light");
  const [bords, setBords] = useState<Bord[]>([]);
  const [activeBordId, setActiveBordId] = useState("");
  const [stickies, setStickies] = useState<StickyNote[]>([]);
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newBordName, setNewBordName] = useState("");
  const [newBordColor, setNewBordColor] = useState(BORD_COLORS[0]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [editingSticky, setEditingSticky] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newStickyText, setNewStickyText] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);

  const dark = theme === "dark";
  const bg = dark ? "#0F0F0F" : "#ffffff";
  const bg2 = dark ? "#1a1a1a" : "#f8f8f8";
  const bg3 = dark ? "#141414" : "#f3f3f3";
  const text = dark ? "#f0f0f0" : "#1a1a1a";
  const text2 = dark ? "#888" : "#666";
  const text3 = dark ? "#555" : "#aaa";
  const border = dark ? "#222" : "#ebebeb";

  const activeBord = bords.find(b => b.id === activeBordId);
  const filteredBords = bords.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

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

  const onMouseUp = useCallback(() => setDragging(null), []);

  const handleAddBord = (templateId?: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    const name = newBordName.trim() || template?.name || "New Bord";
    const id = Date.now().toString();
    setBords(prev => [{ id, name, color: template?.color || newBordColor, createdAt: new Date() }, ...prev]);
    setActiveBordId(id);
    setStickies([]);
    setChecks([]);
    setNewBordName("");
    setShowTemplates(false);
  };

  const handleAddSticky = () => {
    if (!newStickyText.trim()) return;
    const colors: StickyColor[] = ["#FAEEDA", "#E1F5EE", "#EEEDFE", "#FCE8E8", "#E8F0FC"];
    const emojis = ["💡", "🚩", "❓", "⚠️", "📌"];
    const idx = stickies.length % colors.length;
    setStickies(prev => [...prev, { id: Date.now().toString(), x: 60 + (stickies.length % 4) * 200, y: 80 + Math.floor(stickies.length / 4) * 180, text: newStickyText, color: colors[idx], emoji: emojis[idx] }]);
    setNewStickyText("");
  };

  if (view === "landing") return <LandingPage onEnter={() => setView("app")} theme={theme} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: bg, color: text, fontFamily: "sans-serif" }} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", height: 48, borderBottom: `1px solid ${border}`, background: bg, flexShrink: 0 }}>
        <button onClick={() => setView("landing")} style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3, background: "none", border: "none", cursor: "pointer", color: text, fontFamily: "Georgia, serif" }}>
          White<span style={{ color: "#1D9E75" }}>bord</span>
        </button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: text3 }}>Auto-saved</span>
        <button style={{ padding: "5px 10px", border: `1px solid ${border}`, borderRadius: 8, fontSize: 12, color: text2, cursor: "pointer", background: "transparent" }}>Share</button>
        <button style={{ padding: "5px 10px", border: `1px solid ${border}`, borderRadius: 8, fontSize: 12, color: text2, cursor: "pointer", background: "transparent" }}>Export</button>
        <button onClick={() => setShowTemplates(true)} style={{ padding: "5px 12px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>+ Add Bord</button>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ width: 220, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", background: bg, flexShrink: 0 }}>
          <div style={{ padding: 12, borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: `1px solid ${border}`, borderRadius: 8, background: bg2 }}>
              <span style={{ fontSize: 12, color: text3 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bords..." style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: text, width: "100%" }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <p style={{ padding: "10px 12px 4px", fontSize: 10, fontWeight: 500, letterSpacing: "0.6px", color: text3, textTransform: "uppercase" }}>Bords</p>
            {filteredBords.length === 0 && (
              <div style={{ padding: "20px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: text3, marginBottom: 8 }}>No bords yet</p>
                <button onClick={() => setShowTemplates(true)} style={{ fontSize: 12, color: "#1D9E75", background: "none", border: "none", cursor: "pointer" }}>+ Create your first bord</button>
              </div>
            )}
            {filteredBords.map(b => (
              <div key={b.id} onClick={() => setActiveBordId(b.id)} style={{ height: 36, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13, cursor: "pointer", background: b.color, color: "#fff", fontWeight: b.id === activeBordId ? 600 : 400, opacity: b.id === activeBordId ? 1 : 0.85 }}>
                {b.name}
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 12px" }}>
            <button onClick={() => setShowTemplates(true)} style={{ width: "100%", padding: "7px 10px", border: `1px dashed ${border}`, borderRadius: 8, fontSize: 12, color: text3, cursor: "pointer", background: "transparent" }}>+ Add Bord</button>
          </div>
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setShowSettings(true)} style={{ fontSize: 12, color: text3, background: "none", border: "none", cursor: "pointer" }}>⚙ Settings</button>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, background: "#E1F5EE", color: "#0F6E56", padding: "2px 7px", borderRadius: 20, fontWeight: 500 }}>Pro</span>
          </div>
        </div>

        <div ref={canvasRef} style={{ flex: 1, position: "relative", overflow: "hidden", background: bg3, backgroundImage: `radial-gradient(circle, ${dark ? "#2a2a2a" : "#d1d5db"} 1px, transparent 1px)`, backgroundSize: "20px 20px" }}>
          <div style={{ position: "absolute", top: 14, left: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: text2, background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "4px 10px" }}>
              {activeBord ? activeBord.name : "Select or create a bord →"}
            </span>
          </div>

          {!activeBordId && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <p style={{ fontSize: 32 }}>🗒️</p>
              <p style={{ fontSize: 15, color: text2, fontWeight: 500 }}>No bord selected</p>
              <p style={{ fontSize: 13, color: text3 }}>Create a bord to get started</p>
              <button onClick={() => setShowTemplates(true)} style={{ padding: "10px 24px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>+ Create Bord</button>
            </div>
          )}

          {activeBordId && stickies.map(s => (
            <div key={s.id} onMouseDown={e => onMouseDown(e, s.id)} onDoubleClick={() => setEditingSticky(s.id)}
              style={{ position: "absolute", left: s.x, top: s.y, width: 160, padding: 12, borderRadius: 10, background: s.color, color: "#333", fontSize: 12, lineHeight: 1.5, cursor: dragging === s.id ? "grabbing" : "grab", userSelect: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", zIndex: dragging === s.id ? 100 : 1 }}>
              <div style={{ fontSize: 10, fontWeight: 500, marginBottom: 6, opacity: 0.7 }}>{s.emoji}</div>
              {editingSticky === s.id ? (
                <textarea autoFocus defaultValue={s.text}
                  onBlur={e => { setStickies(prev => prev.map(n => n.id === s.id ? { ...n, text: e.target.value } : n)); setEditingSticky(null); }}
                  style={{ background: "transparent", border: "none", outline: "none", resize: "none", width: "100%", fontFamily: "sans-serif", fontSize: 12, color: "#333", lineHeight: 1.5 }} />
              ) : s.text}
            </div>
          ))}

          {activeBordId && (
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

      {showTemplates && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: bg, borderRadius: 16, padding: 28, width: 480, border: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: text }}>New Bord</h2>
              <button onClick={() => setShowTemplates(false)} style={{ background: "none", border: "none", cursor: "pointer", color: text2, fontSize: 18 }}>×</button>
            </div>
            <input value={newBordName} onChange={e => setNewBordName(e.target.value)} placeholder="Bord name..."
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${border}`, borderRadius: 8, fontSize: 13, background: bg2, color: text, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
            <p style={{ fontSize: 11, color: text3, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>Choose a template</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => { setNewBordName(newBordName || t.name); handleAddBord(t.id); }}
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
                {BORD_COLORS.map(c => (
                  <div key={c} onClick={() => setNewBordColor(c)} style={{ width: 20, height: 20, borderRadius: "50%", background: c, cursor: "pointer", border: newBordColor === c ? "2px solid #1a1a1a" : "2px solid transparent" }} />
                ))}
              </div>
              <button onClick={() => handleAddBord()} style={{ padding: "8px 20px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Create</button>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Profile", "Notifications", "Billing", "Privacy"].map(item => (
                <button key={item} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: `1px solid ${border}`, borderRadius: 8, background: "transparent", cursor: "pointer", color: text, fontSize: 13 }}>
                  {item} <span style={{ color: text3 }}>›</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: text3, marginTop: 20, textAlign: "center" }}>Workboard v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
}
