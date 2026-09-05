"use client";
import { useState, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qhmipgdtemabmqhhjbeb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobWlwZ2R0ZW1hYm1xaGhqYmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjA5ODQsImV4cCI6MjEwMzczNjk4NH0.HvPsKjKoJmlD274QNiXhUPIA-RqRyNY1JGJsTJLTkZM",
  { auth: { persistSession: true, storageKey: "workboard-auth" } }
);

type Theme = "light" | "dark";
type View = "landing" | "auth" | "app" | "shared";
type IdeaColor = "#EF9F27" | "#1D9E75" | "#7F77DD" | "#D85A30" | "#378ADD";
type SharePermission = "view" | "edit";

interface Board { id: string; name: string; color: string; created_at: string; shared: boolean; share_id: string; share_permission: SharePermission; }
interface Idea { id: string; x: number; y: number; text: string; color: IdeaColor; icon: string; board_id: string; }

const FREE_BOARD_LIMIT = 4;

const IDEA_ICONS = [
  { id: "lightbulb", label: "Idea", svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L15 17H9l-.7-2C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/></svg> },
  { id: "flag", label: "Priority", svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> },
  { id: "question", label: "Question", svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { id: "alert", label: "Blocker", svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { id: "pin", label: "Note", svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
];

const IDEA_COLORS: IdeaColor[] = ["#EF9F27", "#1D9E75", "#7F77DD", "#D85A30", "#378ADD"];

const TEMPLATES = [
  { id: "meeting", name: "Team Meeting", icon: "👥", color: "#1D9E75", description: "Agenda, action items, decisions" },
  { id: "brainstorm", name: "Brainstorm", icon: "💡", color: "#7F77DD", description: "Ideas, themes, mind mapping" },
  { id: "sprint", name: "Sprint Planning", icon: "🚀", color: "#EF9F27", description: "Stories, tasks, blockers" },
  { id: "retro", name: "Retrospective", icon: "🔁", color: "#378ADD", description: "What went well, improvements" },
  { id: "blank", name: "Blank Canvas", icon: "✨", color: "#D85A30", description: "Start from scratch" },
];

const BOARD_COLORS = ["#1D9E75","#7F77DD","#EF9F27","#D85A30","#378ADD","#E05C94","#2BBCD4","#8BC34A"];

// ── Landing ────────────────────────────────────────────────────────────────
function LandingPage({ onEnter, onLogin, theme }: { onEnter: () => void; onLogin: () => void; theme: Theme }) {
  const dark = theme === "dark";
  return (
    <div style={{ minHeight: "100dvh", background: dark ? "#0F0F0F" : "#fff", color: dark ? "#f0f0f0" : "#1a1a1a", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${dark?"#222":"#f0f0f0"}` }}>
        <span style={{ fontSize: 20, fontWeight: 600 }}>Work<span style={{ color: "#1D9E75" }}>board</span></span>
        <div style={{ flex: 1 }} />
        <button onClick={onLogin} style={{ padding: "8px 16px", background: "transparent", color: dark?"#aaa":"#555", border: `1px solid ${dark?"#333":"#e0e0e0"}`, borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginRight: 8 }}>Log in</button>
        <button onClick={onEnter} style={{ padding: "8px 20px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Sign up free</button>
      </nav>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, background: "#E1F5EE", color: "#0F6E56", fontSize: 12, fontWeight: 500, marginBottom: 24, fontFamily: "sans-serif" }}>✦ Now in beta</div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24, letterSpacing: -2 }}>
          Meeting notes that<br /><span style={{ color: "#1D9E75" }}>actually make sense.</span>
        </h1>
        <p style={{ fontSize: 17, color: dark?"#888":"#666", maxWidth: 480, lineHeight: 1.7, marginBottom: 40, fontFamily: "sans-serif", fontWeight: 300 }}>
          Workboard is a visual, collaborative workspace for meetings, brainstorming, and planning.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          <button onClick={onEnter} style={{ padding: "13px 30px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, cursor: "pointer", fontFamily: "sans-serif", fontWeight: 500 }}>Get started free</button>
          <button onClick={onLogin} style={{ padding: "13px 30px", background: "transparent", border: `1px solid ${dark?"#333":"#e0e0e0"}`, borderRadius: 10, fontSize: 15, cursor: "pointer", color: dark?"#aaa":"#555", fontFamily: "sans-serif" }}>Log in</button>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ background: dark?"#1a1a1a":"#f8f8f8", border: `1px solid ${dark?"#222":"#e8e8e8"}`, borderRadius: 12, padding: "16px 24px", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Free</div>
            <div style={{ fontSize: 12, color: dark?"#888":"#666", marginTop: 4 }}>4 boards · Basic features</div>
          </div>
          <div style={{ background: "#1D9E75", borderRadius: 12, padding: "16px 24px", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Pro $9/mo</div>
            <div style={{ fontSize: 12, color: "#9FE1CB", marginTop: 4 }}>Unlimited boards · All features</div>
          </div>
        </div>
      </div>
      <footer style={{ padding: "20px 40px", borderTop: `1px solid ${dark?"#1a1a1a":"#f0f0f0"}`, display: "flex", justifyContent: "space-between", fontSize: 12, color: dark?"#555":"#aaa", fontFamily: "sans-serif" }}>
        <span>© 2025 Workboard</span><span>Privacy · Terms</span>
      </footer>
    </div>
  );
}

// ── Auth ───────────────────────────────────────────────────────────────────
function AuthPage({ mode, onSuccess, onSwitch, theme }: { mode: "login"|"signup"; onSuccess: ()=>void; onSwitch: ()=>void; theme: Theme }) {
  const dark = theme === "dark";
  const bg = dark?"#0F0F0F":"#fff"; const bg2 = dark?"#1a1a1a":"#f8f8f8";
  const text = dark?"#f0f0f0":"#1a1a1a"; const text2 = dark?"#888":"#666"; const border = dark?"#222":"#ebebeb";
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      if (mode === "signup") { const { error } = await supabase.auth.signUp({ email, password }); if (error) throw error; }
      else { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; }
      onSuccess();
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight: "100dvh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ width: 380, background: bg2, border: `1px solid ${border}`, borderRadius: 16, padding: 32, margin: "0 16px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: text, marginBottom: 6, textAlign: "center" }}>Work<span style={{ color: "#1D9E75" }}>board</span></h2>
        <p style={{ fontSize: 14, color: text2, textAlign: "center", marginBottom: 28 }}>{mode==="signup"?"Create your free account":"Welcome back"}</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={{ width:"100%", padding:"10px 14px", border:`1px solid ${border}`, borderRadius:8, fontSize:13, background:bg, color:text, outline:"none", marginBottom:10, boxSizing:"border-box" }}/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" onKeyDown={e=>e.key==="Enter"&&handleSubmit()} style={{ width:"100%", padding:"10px 14px", border:`1px solid ${border}`, borderRadius:8, fontSize:13, background:bg, color:text, outline:"none", marginBottom:16, boxSizing:"border-box" }}/>
        {error && <p style={{ fontSize:12, color:"#E05C5C", marginBottom:12 }}>{error}</p>}
        <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", padding:"11px", background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, fontSize:14, cursor:"pointer", fontWeight:500, opacity:loading?0.7:1 }}>{loading?"...":mode==="signup"?"Create account":"Log in"}</button>
        <p style={{ fontSize:12, color:text2, textAlign:"center", marginTop:16 }}>{mode==="signup"?"Already have an account? ":"Don't have an account? "}<span onClick={onSwitch} style={{ color:"#1D9E75", cursor:"pointer" }}>{mode==="signup"?"Log in":"Sign up"}</span></p>
      </div>
    </div>
  );
}

// ── Shared Board ───────────────────────────────────────────────────────────
function SharedBoardView({ shareId, theme }: { shareId: string; theme: Theme }) {
  const dark = theme === "dark";
  const bg = dark?"#0F0F0F":"#fff"; const bg2 = dark?"#1a1a1a":"#f8f8f8"; const bg3 = dark?"#141414":"#f3f3f3";
  const text = dark?"#f0f0f0":"#1a1a1a"; const text2 = dark?"#888":"#666"; const border = dark?"#222":"#ebebeb";
  const [board, setBoard] = useState<Board|null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [dragging, setDragging] = useState<string|null>(null);
  const [dragOffset, setDragOffset] = useState({x:0,y:0});

  const load = useCallback(async () => {
    const { data: b } = await supabase.from("boards").select("*").eq("share_id", shareId).eq("shared", true).single();
    if (b) { setBoard(b); const { data: s } = await supabase.from("stickies").select("*").eq("board_id", b.id); if (s) setIdeas(s); }
    setLoading(false);
  }, [shareId]);

  useEffect(() => {
    load();
    const ch = supabase.channel(`shared-${shareId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "stickies" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [shareId, load]);

  const canEdit = board?.share_permission === "edit";

  const onMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (!canEdit) return;
    const idea = ideas.find(s=>s.id===id); if (!idea) return;
    setDragging(id); setDragOffset({x:e.clientX-idea.x, y:e.clientY-idea.y}); e.preventDefault();
  }, [ideas, canEdit]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setIdeas(prev=>prev.map(s=>s.id===dragging?{...s,x:e.clientX-dragOffset.x,y:e.clientY-dragOffset.y}:s));
  }, [dragging, dragOffset]);

  const onMouseUp = useCallback(async () => {
    if (dragging) { const idea = ideas.find(s=>s.id===dragging); if (idea) await supabase.from("stickies").update({x:idea.x,y:idea.y}).eq("id",idea.id); }
    setDragging(null);
  }, [dragging, ideas]);

  const handleAdd = async () => {
    if (!newText.trim()||!board) return;
    const idx = ideas.length % IDEA_COLORS.length;
    const iconIdx = ideas.length % IDEA_ICONS.length;
    const { data } = await supabase.from("stickies").insert({ board_id:board.id, text:newText, color:IDEA_COLORS[idx], icon:IDEA_ICONS[iconIdx].id, x:60+(ideas.length%4)*200, y:80+Math.floor(ideas.length/4)*180 }).select().single();
    if (data) setIdeas(prev=>[...prev,data]);
    setNewText("");
  };

  if (loading) return <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:bg, fontSize:14, color:text2, fontFamily:"sans-serif" }}>Loading board...</div>;
  if (!board) return <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:bg, fontSize:14, color:text2, fontFamily:"sans-serif" }}>Board not found.</div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:bg, fontFamily:"sans-serif" }} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 16px", height:48, borderBottom:`1px solid ${border}`, background:bg }}>
        <span style={{ fontSize:15, fontWeight:600, color:text, fontFamily:"Georgia, serif" }}>Work<span style={{ color:"#1D9E75" }}>board</span></span>
        <div style={{ flex:1 }}/>
        <span style={{ fontSize:12, background:canEdit?"#E1F5EE":"#F1EFE8", color:canEdit?"#0F6E56":"#666", padding:"3px 10px", borderRadius:20, fontWeight:500 }}>{canEdit?"✏️ Can edit":"👁 View only"}</span>
      </div>
      <div style={{ padding:"10px 16px", borderBottom:`1px solid ${border}`, background:bg }}>
        <h2 style={{ fontSize:16, fontWeight:600, color:text, margin:0 }}>{board.name}</h2>
      </div>
      <div style={{ flex:1, position:"relative", background:bg3, backgroundImage:`radial-gradient(circle, ${dark?"#2a2a2a":"#d1d5db"} 1px, transparent 1px)`, backgroundSize:"20px 20px" }}>
        {ideas.map(s => {
          const iconDef = IDEA_ICONS.find(i=>i.id===s.icon)||IDEA_ICONS[0];
          return (
            <div key={s.id} onMouseDown={e=>onMouseDown(e,s.id)}
              style={{ position:"absolute", left:s.x, top:s.y, width:160, padding:12, borderRadius:10, background:bg, border:`2px solid ${s.color}`, color:text, fontSize:12, lineHeight:1.5, cursor:canEdit?(dragging===s.id?"grabbing":"grab"):"default", userSelect:"none", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:6, color:s.color }}>
                {iconDef.svg}
                <span style={{ fontSize:10, fontWeight:600 }}>{iconDef.label}</span>
              </div>
              {s.text}
            </div>
          );
        })}
        {ideas.length===0 && <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ fontSize:14, color:text2 }}>This board is empty</p></div>}
        {canEdit && (
          <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8, background:bg, border:`1px solid ${border}`, borderRadius:24, padding:"6px 10px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
            <input value={newText} onChange={e=>setNewText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="Add an idea and press Enter..." style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:text, width:260 }}/>
            <button onClick={handleAdd} style={{ padding:"4px 12px", background:"#1D9E75", color:"#fff", border:"none", borderRadius:16, fontSize:12, cursor:"pointer" }}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>("landing");
  const [authMode, setAuthMode] = useState<"login"|"signup">("signup");
  const [theme, setTheme] = useState<Theme>("light");
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDeleteBoardConfirm, setShowDeleteBoardConfirm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardColor, setNewBoardColor] = useState(BOARD_COLORS[0]);
  const [dragging, setDragging] = useState<string|null>(null);
  const [dragOffset, setDragOffset] = useState({x:0,y:0});
  const [editingIdea, setEditingIdea] = useState<string|null>(null);
  const [search, setSearch] = useState("");
  const [newIdeaText, setNewIdeaText] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedBoardId, setSharedBoardId] = useState("");
  const [sharePermission, setSharePermission] = useState<SharePermission>("view");

  const dark = theme === "dark";
  const bg = dark?"#0F0F0F":"#fff"; const bg2 = dark?"#1a1a1a":"#f8f8f8"; const bg3 = dark?"#141414":"#f3f3f3";
  const text = dark?"#f0f0f0":"#1a1a1a"; const text2 = dark?"#888":"#666"; const text3 = dark?"#555":"#aaa"; const border = dark?"#222":"#ebebeb";

  const activeBoard = boards.find(b=>b.id===activeBoardId);
  const filteredBoards = boards.filter(b=>b.name.toLowerCase().includes(search.toLowerCase()));
  const atBoardLimit = !isPro && boards.length >= FREE_BOARD_LIMIT;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get("share");
    if (shareId) { setSharedBoardId(shareId); setView("shared"); setLoading(false); return; }
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user??null);
      if (session?.user) {
        setView("app");
        const { data: profile } = await supabase.from("profiles").select("is_pro").eq("id", session.user.id).single();
        if (profile?.is_pro) setIsPro(true);
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get("upgrade") === "success" && session?.user) {
        await supabase.from("profiles").upsert({ id: session.user.id, is_pro: true });
        setIsPro(true);
        window.history.replaceState({}, "", "/");
      }
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user??null);
      if (session?.user) { setView("app"); loadBoards(); }
      else if (!sharedBoardId) setView("landing");
    });
  }, []);

  const loadBoards = async () => { const { data } = await supabase.from("boards").select("*").order("created_at",{ascending:false}); if (data) setBoards(data); };
  const loadIdeas = async (boardId: string) => { const { data } = await supabase.from("stickies").select("*").eq("board_id",boardId); if (data) setIdeas(data); };

  useEffect(() => { if (user) loadBoards(); }, [user]);
  useEffect(() => {
    if (!activeBoardId) { setIdeas([]); return; }
    loadIdeas(activeBoardId);
    const ch = supabase.channel(`board-${activeBoardId}`)
      .on("postgres_changes", { event:"*", schema:"public", table:"stickies", filter:`board_id=eq.${activeBoardId}` }, () => loadIdeas(activeBoardId))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [activeBoardId]);

  const onMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    const idea = ideas.find(s=>s.id===id); if (!idea) return;
    setDragging(id); setDragOffset({x:e.clientX-idea.x,y:e.clientY-idea.y}); e.preventDefault();
  }, [ideas]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setIdeas(prev=>prev.map(s=>s.id===dragging?{...s,x:e.clientX-dragOffset.x,y:e.clientY-dragOffset.y}:s));
  }, [dragging, dragOffset]);

  const onMouseUp = useCallback(async () => {
    if (dragging) { const idea = ideas.find(s=>s.id===dragging); if (idea) await supabase.from("stickies").update({x:idea.x,y:idea.y}).eq("id",idea.id); }
    setDragging(null);
  }, [dragging, ideas]);

  const handleAddBoard = async (templateId?: string) => {
    if (atBoardLimit) { setShowTemplates(false); setShowUpgradeModal(true); return; }
    const template = TEMPLATES.find(t=>t.id===templateId);
    const name = newBoardName.trim()||template?.name||"New Board";
    const color = template?.color||newBoardColor;
    const { data } = await supabase.from("boards").insert({ name, color, user_id:user.id, shared:false, share_permission:"view" }).select().single();
    if (data) { setBoards(prev=>[data,...prev]); setActiveBoardId(data.id); setIdeas([]); }
    setNewBoardName(""); setShowTemplates(false);
  };

  const handleDeleteBoard = async () => {
    if (!activeBoardId) return;
    await supabase.from("stickies").delete().eq("board_id", activeBoardId);
    await supabase.from("boards").delete().eq("id", activeBoardId);
    setBoards(prev=>prev.filter(b=>b.id!==activeBoardId));
    setActiveBoardId(""); setIdeas([]); setShowDeleteBoardConfirm(false);
  };

  const handleDeleteIdea = async (id: string) => {
    await supabase.from("stickies").delete().eq("id", id);
    setIdeas(prev=>prev.filter(s=>s.id!==id));
  };

  const handleAddIdea = async () => {
    if (!newIdeaText.trim()||!activeBoardId) return;
    const idx = ideas.length % IDEA_COLORS.length;
    const iconIdx = ideas.length % IDEA_ICONS.length;
    const { data } = await supabase.from("stickies").insert({ board_id:activeBoardId, text:newIdeaText, color:IDEA_COLORS[idx], icon:IDEA_ICONS[iconIdx].id, x:60+(ideas.length%4)*200, y:80+Math.floor(ideas.length/4)*180 }).select().single();
    if (data) setIdeas(prev=>[...prev,data]);
    setNewIdeaText("");
  };

  const handleToggleShare = async () => {
    if (!activeBoard) return;
    const newShared = !activeBoard.shared;
    await supabase.from("boards").update({ shared:newShared, share_permission:sharePermission }).eq("id",activeBoard.id);
    setBoards(prev=>prev.map(b=>b.id===activeBoard.id?{...b,shared:newShared,share_permission:sharePermission}:b));
  };

  const handleUpdatePermission = async (perm: SharePermission) => {
    setSharePermission(perm);
    if (activeBoard?.shared) { await supabase.from("boards").update({share_permission:perm}).eq("id",activeBoard.id); setBoards(prev=>prev.map(b=>b.id===activeBoard.id?{...b,share_permission:perm}:b)); }
  };

  const handleCopyLink = () => {
    if (!activeBoard) return;
    navigator.clipboard.writeText(`${window.location.origin}?share=${activeBoard.share_id}`);
    setCopiedLink(true); setTimeout(()=>setCopiedLink(false),2000);
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); setBoards([]); setIdeas([]); setActiveBoardId(""); setView("landing"); };

  if (loading) return <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", fontSize:14, color:"#aaa", fontFamily:"sans-serif" }}>Loading...</div>;
  if (view==="shared") return <SharedBoardView shareId={sharedBoardId} theme={theme}/>;
  if (view==="landing") return <LandingPage onEnter={()=>{setAuthMode("signup");setView("auth");}} onLogin={()=>{setAuthMode("login");setView("auth");}} theme={theme}/>;
  if (view==="auth") return <AuthPage mode={authMode} onSuccess={()=>setView("app")} onSwitch={()=>setAuthMode(authMode==="signup"?"login":"signup")} theme={theme}/>;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:bg, color:text, fontFamily:"sans-serif" }} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>

      {/* Topbar */}
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 16px", height:48, borderBottom:`1px solid ${border}`, background:bg, flexShrink:0 }}>
        <button onClick={()=>setView("landing")} style={{ fontSize:15, fontWeight:600, background:"none", border:"none", cursor:"pointer", color:text, fontFamily:"Georgia, serif" }}>Work<span style={{ color:"#1D9E75" }}>board</span></button>
        <div style={{ flex:1 }}/>
        <span style={{ fontSize:11, color:text3 }}>Auto-saved</span>
        {activeBoardId && <button onClick={()=>setShowShareModal(true)} style={{ padding:"5px 10px", border:`1px solid ${border}`, borderRadius:8, fontSize:12, color:text2, cursor:"pointer", background:"transparent" }}>🔗 Share</button>}
        {activeBoardId && <button onClick={()=>setShowDeleteBoardConfirm(true)} style={{ padding:"5px 10px", border:`1px solid #E05C5C`, borderRadius:8, fontSize:12, color:"#E05C5C", cursor:"pointer", background:"transparent" }}>Delete board</button>}
        <button onClick={()=>setShowSettings(true)} style={{ padding:"5px 10px", border:`1px solid ${border}`, borderRadius:8, fontSize:12, color:text2, cursor:"pointer", background:"transparent" }}>⚙</button>
        <button onClick={()=>atBoardLimit?setShowUpgradeModal(true):setShowTemplates(true)} style={{ padding:"5px 12px", background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, fontSize:12, cursor:"pointer" }}>+ Add Board</button>
      </div>

      <div style={{ display:"flex", flex:1, minHeight:0 }}>
        {/* Sidebar */}
        <div style={{ width:220, borderRight:`1px solid ${border}`, display:"flex", flexDirection:"column", background:bg, flexShrink:0 }}>
          <div style={{ padding:12, borderBottom:`1px solid ${border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 10px", border:`1px solid ${border}`, borderRadius:8, background:bg2 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={text3} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search boards..." style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:text, width:"100%" }}/>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            <div style={{ padding:"10px 12px 4px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:10, fontWeight:500, letterSpacing:"0.6px", color:text3, textTransform:"uppercase" }}>Boards</span>
              {!isPro && <span style={{ fontSize:10, color:text3 }}>{boards.length}/{FREE_BOARD_LIMIT}</span>}
            </div>
            {filteredBoards.length===0 && (
              <div style={{ padding:"20px 12px", textAlign:"center" }}>
                <p style={{ fontSize:12, color:text3, marginBottom:8 }}>No boards yet</p>
                <button onClick={()=>setShowTemplates(true)} style={{ fontSize:12, color:"#1D9E75", background:"none", border:"none", cursor:"pointer" }}>+ Create your first board</button>
              </div>
            )}
            {filteredBoards.map(b => (
              <div key={b.id} onClick={()=>setActiveBoardId(b.id)} style={{ height:36, display:"flex", alignItems:"center", padding:"0 12px", fontSize:13, cursor:"pointer", background:b.color, color:"#fff", fontWeight:b.id===activeBoardId?600:400, opacity:b.id===activeBoardId?1:0.85 }}>
                <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.name}</span>
                {b.shared && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ marginLeft:4 }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
              </div>
            ))}
            {atBoardLimit && (
              <div onClick={()=>setShowUpgradeModal(true)} style={{ margin:"8px 12px", padding:"10px", background:"#E1F5EE", borderRadius:8, cursor:"pointer", textAlign:"center" }}>
                <p style={{ fontSize:11, color:"#0F6E56", fontWeight:500 }}>✨ Upgrade to Pro</p>
                <p style={{ fontSize:10, color:"#1D9E75", marginTop:2 }}>Unlock unlimited boards</p>
              </div>
            )}
          </div>
          <div style={{ padding:"8px 12px" }}>
            <button onClick={()=>atBoardLimit?setShowUpgradeModal(true):setShowTemplates(true)} style={{ width:"100%", padding:"7px 10px", border:`1px dashed ${border}`, borderRadius:8, fontSize:12, color:atBoardLimit?"#1D9E75":text3, cursor:"pointer", background:"transparent" }}>
              {atBoardLimit?"✨ Upgrade for more":"+ Add Board"}
            </button>
          </div>
          <div style={{ padding:"10px 12px", borderTop:`1px solid ${border}`, display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={()=>setShowSettings(true)} style={{ fontSize:12, color:text3, background:"none", border:"none", cursor:"pointer" }}>⚙ Settings</button>
            <div style={{ flex:1 }}/>
            <span onClick={()=>!isPro&&setShowUpgradeModal(true)} style={{ fontSize:10, background:isPro?"#E1F5EE":"#F1EFE8", color:isPro?"#0F6E56":"#888", padding:"2px 7px", borderRadius:20, fontWeight:500, cursor:"pointer" }}>{isPro?"Pro ✓":"Free"}</span>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex:1, position:"relative", overflow:"hidden", background:bg3, backgroundImage:`radial-gradient(circle, ${dark?"#2a2a2a":"#d1d5db"} 1px, transparent 1px)`, backgroundSize:"20px 20px" }}>

          {/* Board title bar */}
          {activeBoard && (
            <div style={{ position:"absolute", top:0, left:0, right:0, padding:"10px 16px", background:bg, borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", gap:8, zIndex:5 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:activeBoard.color, flexShrink:0 }}/>
              <span style={{ fontSize:14, fontWeight:600, color:text }}>{activeBoard.name}</span>
              <span style={{ fontSize:11, color:text3 }}>· {ideas.length} idea{ideas.length!==1?"s":""}</span>
            </div>
          )}

          {!activeBoardId && (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={text3} strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
              <p style={{ fontSize:15, color:text2, fontWeight:500 }}>No board selected</p>
              <p style={{ fontSize:13, color:text3 }}>Create a board to get started</p>
              <button onClick={()=>atBoardLimit?setShowUpgradeModal(true):setShowTemplates(true)} style={{ padding:"10px 24px", background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, fontSize:13, cursor:"pointer" }}>+ Create Board</button>
            </div>
          )}

          {activeBoardId && ideas.map(s => {
            const iconDef = IDEA_ICONS.find(i=>i.id===s.icon)||IDEA_ICONS[0];
            return (
              <div key={s.id} onMouseDown={e=>onMouseDown(e,s.id)} onDoubleClick={()=>setEditingIdea(s.id)}
                style={{ position:"absolute", left:s.x, top:s.y+(activeBoard?44:0), width:160, padding:12, borderRadius:10, background:bg, border:`2px solid ${s.color}`, color:text, fontSize:12, lineHeight:1.5, cursor:dragging===s.id?"grabbing":"grab", userSelect:"none", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", zIndex:dragging===s.id?100:1 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, color:s.color }}>
                    {iconDef.svg}
                    <span style={{ fontSize:10, fontWeight:600 }}>{iconDef.label}</span>
                  </div>
                  <button onClick={e=>{e.stopPropagation();handleDeleteIdea(s.id);}} style={{ background:"none", border:"none", cursor:"pointer", color:text3, fontSize:14, lineHeight:1, padding:"0 2px" }}>×</button>
                </div>
                {editingIdea===s.id ? (
                  <textarea autoFocus defaultValue={s.text}
                    onBlur={async e => { await supabase.from("stickies").update({text:e.target.value}).eq("id",s.id); setIdeas(prev=>prev.map(n=>n.id===s.id?{...n,text:e.target.value}:n)); setEditingIdea(null); }}
                    style={{ background:"transparent", border:"none", outline:"none", resize:"none", width:"100%", fontFamily:"sans-serif", fontSize:12, color:text, lineHeight:1.5 }}/>
                ) : s.text}
              </div>
            );
          })}

          {activeBoardId && (
            <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8, background:bg, border:`1px solid ${border}`, borderRadius:24, padding:"6px 10px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", zIndex:10 }}>
              <input value={newIdeaText} onChange={e=>setNewIdeaText(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleAddIdea()}
                placeholder="Add an idea and press Enter..."
                style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:text, width:260 }}/>
              <button onClick={handleAddIdea} style={{ padding:"4px 12px", background:"#1D9E75", color:"#fff", border:"none", borderRadius:16, fontSize:12, cursor:"pointer" }}>Add</button>
            </div>
          )}
        </div>
      </div>

      {/* Delete board confirm */}
      {showDeleteBoardConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300 }}>
          <div style={{ background:bg, borderRadius:16, padding:28, width:340, border:`1px solid ${border}`, textAlign:"center" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E05C5C" strokeWidth="2" style={{ marginBottom:12 }}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            <h3 style={{ fontSize:16, fontWeight:600, color:text, marginBottom:8 }}>Delete "{activeBoard?.name}"?</h3>
            <p style={{ fontSize:13, color:text2, marginBottom:20 }}>This will permanently delete the board and all its ideas.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowDeleteBoardConfirm(false)} style={{ flex:1, padding:"10px", border:`1px solid ${border}`, borderRadius:8, background:"transparent", cursor:"pointer", color:text2, fontSize:13 }}>Cancel</button>
              <button onClick={handleDeleteBoard} style={{ flex:1, padding:"10px", border:"none", borderRadius:8, background:"#E05C5C", cursor:"pointer", color:"#fff", fontSize:13, fontWeight:500 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300 }}>
          <div style={{ background:bg, borderRadius:16, padding:32, width:380, border:`1px solid ${border}`, textAlign:"center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.5" style={{ marginBottom:12 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <h2 style={{ fontSize:20, fontWeight:700, color:text, marginBottom:8 }}>Upgrade to Pro</h2>
            <p style={{ fontSize:14, color:text2, marginBottom:24, lineHeight:1.6 }}>You've reached the {FREE_BOARD_LIMIT} board free limit. Upgrade to Pro for unlimited boards, all templates, and priority support.</p>
            <div style={{ display:"flex", gap:12, marginBottom:20 }}>
              <div style={{ flex:1, padding:"12px", border:`1px solid ${border}`, borderRadius:10 }}>
                <div style={{ fontSize:16, fontWeight:600, color:text }}>Free</div>
                <div style={{ fontSize:12, color:text3, marginTop:4 }}>4 boards max</div>
              </div>
              <div style={{ flex:1, padding:"12px", background:"#1D9E75", borderRadius:10 }}>
                <div style={{ fontSize:16, fontWeight:600, color:"#fff" }}>Pro</div>
                <div style={{ fontSize:12, color:"#9FE1CB", marginTop:4 }}>$9 / month</div>
                <div style={{ fontSize:12, color:"#9FE1CB" }}>Unlimited boards</div>
              </div>
            </div>
            <button onClick={async () => {
              const res = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, email: user.email }),
              });
              const { url } = await res.json();
              window.location.href = url;
            }} style={{ width:"100%", padding:"12px", background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, fontSize:14, cursor:"pointer", fontWeight:500, marginBottom:10 }}>
              Upgrade to Pro — $9/mo
            </button>
            <p style={{ fontSize:11, color:text3, marginBottom:12 }}>Stripe payment coming soon · Click to unlock now</p>
            <button onClick={()=>setShowUpgradeModal(false)} style={{ background:"none", border:"none", cursor:"pointer", color:text3, fontSize:13 }}>Maybe later</button>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShareModal && activeBoard && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:bg, borderRadius:16, padding:28, width:400, border:`1px solid ${border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:16, fontWeight:600, color:text }}>Share Board</h2>
              <button onClick={()=>setShowShareModal(false)} style={{ background:"none", border:"none", cursor:"pointer", color:text2, fontSize:18 }}>×</button>
            </div>
            <p style={{ fontSize:11, color:text3, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:500 }}>Permission</p>
            <div style={{ display:"flex", background:bg2, borderRadius:10, padding:4, marginBottom:16, border:`1px solid ${border}` }}>
              {(["view","edit"] as SharePermission[]).map(p=>(
                <button key={p} onClick={()=>handleUpdatePermission(p)}
                  style={{ flex:1, padding:"7px 0", borderRadius:7, fontSize:13, cursor:"pointer", border:"none", background:(activeBoard.share_permission||sharePermission)===p?bg:"transparent", color:(activeBoard.share_permission||sharePermission)===p?text:text3, fontWeight:(activeBoard.share_permission||sharePermission)===p?500:400 }}>
                  {p==="view"?"👁 View only":"✏️ Can edit"}
                </button>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", border:`1px solid ${border}`, borderRadius:10, marginBottom:16 }}>
              <div>
                <p style={{ fontSize:13, fontWeight:500, color:text, margin:0 }}>Public link sharing</p>
                <p style={{ fontSize:11, color:text3, margin:"2px 0 0" }}>Anyone with the link can {activeBoard.share_permission==="edit"?"edit":"view"}</p>
              </div>
              <div onClick={handleToggleShare} style={{ width:40, height:22, borderRadius:11, background:activeBoard.shared?"#1D9E75":border, cursor:"pointer", position:"relative", transition:"background 0.2s" }}>
                <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:activeBoard.shared?21:3, transition:"left 0.2s" }}/>
              </div>
            </div>
            {activeBoard.shared && (
              <div>
                <p style={{ fontSize:11, color:text3, marginBottom:8 }}>Share this link:</p>
                <div style={{ display:"flex", gap:8 }}>
                  <div style={{ flex:1, padding:"8px 12px", background:bg2, border:`1px solid ${border}`, borderRadius:8, fontSize:11, color:text2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {`${typeof window!=="undefined"?window.location.origin:""}?share=${activeBoard.share_id}`}
                  </div>
                  <button onClick={handleCopyLink} style={{ padding:"8px 14px", background:copiedLink?"#1D9E75":bg2, color:copiedLink?"#fff":text2, border:`1px solid ${border}`, borderRadius:8, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
                    {copiedLink?"✓ Copied!":"Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates modal */}
      {showTemplates && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:bg, borderRadius:16, padding:28, width:480, border:`1px solid ${border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:16, fontWeight:600, color:text }}>New Board</h2>
              <button onClick={()=>setShowTemplates(false)} style={{ background:"none", border:"none", cursor:"pointer", color:text2, fontSize:18 }}>×</button>
            </div>
            <input value={newBoardName} onChange={e=>setNewBoardName(e.target.value)} placeholder="Board name..."
              style={{ width:"100%", padding:"10px 14px", border:`1px solid ${border}`, borderRadius:8, fontSize:13, background:bg2, color:text, outline:"none", marginBottom:16, boxSizing:"border-box" }}/>
            <p style={{ fontSize:11, color:text3, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:500 }}>Choose a template</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>{setNewBoardName(newBoardName||t.name);handleAddBoard(t.id);}}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", border:`1px solid ${border}`, borderRadius:10, cursor:"pointer", background:bg2, textAlign:"left" }}>
                  <span style={{ fontSize:20 }}>{t.icon}</span>
                  <div>
                    <p style={{ fontSize:13, fontWeight:500, color:text, margin:0 }}>{t.name}</p>
                    <p style={{ fontSize:11, color:text3, margin:0 }}>{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ display:"flex", gap:6, flex:1, alignItems:"center" }}>
                {BOARD_COLORS.map(c=>(
                  <div key={c} onClick={()=>setNewBoardColor(c)} style={{ width:20, height:20, borderRadius:"50%", background:c, cursor:"pointer", border:newBoardColor===c?"2px solid #1a1a1a":"2px solid transparent" }}/>
                ))}
              </div>
              <button onClick={()=>handleAddBoard()} style={{ padding:"8px 20px", background:"#1D9E75", color:"#fff", border:"none", borderRadius:8, fontSize:13, cursor:"pointer" }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:bg, borderRadius:16, padding:28, width:360, border:`1px solid ${border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:16, fontWeight:600, color:text }}>Settings</h2>
              <button onClick={()=>setShowSettings(false)} style={{ background:"none", border:"none", cursor:"pointer", color:text2, fontSize:18 }}>×</button>
            </div>
            <p style={{ fontSize:11, color:text3, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:500, marginBottom:12 }}>Appearance</p>
            <div style={{ display:"flex", background:bg2, borderRadius:10, padding:4, marginBottom:20, border:`1px solid ${border}` }}>
              {(["light","dark"] as Theme[]).map(t=>(
                <button key={t} onClick={()=>setTheme(t)} style={{ flex:1, padding:"7px 0", borderRadius:7, fontSize:13, cursor:"pointer", border:"none", background:theme===t?bg:"transparent", color:theme===t?text:text3, fontWeight:theme===t?500:400, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                  {t==="light"?"☀️":"🌙"} {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
            <p style={{ fontSize:11, color:text3, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:500, marginBottom:12 }}>Plan</p>
            <div style={{ padding:"12px 14px", border:`1px solid ${border}`, borderRadius:8, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <p style={{ fontSize:13, fontWeight:500, color:text, margin:0 }}>{isPro?"Pro Plan":"Free Plan"}</p>
                <p style={{ fontSize:11, color:text3, margin:"2px 0 0" }}>{isPro?"Unlimited boards":`${boards.length}/${FREE_BOARD_LIMIT} boards used`}</p>
              </div>
              {!isPro && <button onClick={()=>{setShowSettings(false);setShowUpgradeModal(true);}} style={{ padding:"6px 12px", background:"#1D9E75", color:"#fff", border:"none", borderRadius:6, fontSize:12, cursor:"pointer" }}>Upgrade</button>}
            </div>
            <p style={{ fontSize:11, color:text3, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:500, marginBottom:12, marginTop:16 }}>Account</p>
            <div style={{ padding:"10px 14px", border:`1px solid ${border}`, borderRadius:8, marginBottom:8 }}>
              <p style={{ fontSize:12, color:text2, margin:0 }}>{user?.email}</p>
            </div>
            <button onClick={handleSignOut} style={{ width:"100%", padding:"10px", border:`1px solid #E05C5C`, borderRadius:8, background:"transparent", cursor:"pointer", color:"#E05C5C", fontSize:13 }}>Sign out</button>
            <p style={{ fontSize:11, color:text3, marginTop:20, textAlign:"center" }}>Workboard v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
}
