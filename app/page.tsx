export default function Home() {
  return (
    <div className="flex h-screen bg-white text-gray-900">

      {/* Sidebar */}
      <div className="w-56 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-base font-medium">White<span className="text-emerald-500">bord</span></h1>
        </div>
        <div className="p-3 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search bords..."
            className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <p className="px-3 pt-3 pb-1 text-[10px] font-medium tracking-widest text-gray-400 uppercase">Pinned</p>
          <div className="h-9 flex items-center px-3 text-sm font-medium text-white" style={{background:"#1D9E75"}}>Q3 Planning Session</div>
          <div className="h-9 flex items-center px-3 text-sm text-white" style={{background:"#7F77DD"}}>Product Roadmap</div>
          <p className="px-3 pt-3 pb-1 text-[10px] font-medium tracking-widest text-gray-400 uppercase">Recent</p>
          <div className="h-9 flex items-center px-3 text-sm text-white" style={{background:"#EF9F27"}}>UX Research Notes</div>
          <div className="h-9 flex items-center px-3 text-sm text-white" style={{background:"#D85A30"}}>Onboarding Flow</div>
          <div className="h-9 flex items-center px-3 text-sm text-white" style={{background:"#378ADD"}}>Weekly Standup</div>
        </div>
        <div className="p-3 border-t border-gray-100">
          <button className="w-full text-xs px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors">
            + Add Bord
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 justify-end">
          <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">Share</button>
          <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">Export</button>
          <button className="text-xs px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">+ Add Bord</button>
        </div>
        <div className="flex-1 relative bg-gray-50" style={{backgroundImage:"radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize:"20px 20px"}}>
          {/* Sticky notes */}
          <div className="absolute top-16 left-6 w-40 p-3 rounded-xl text-xs leading-relaxed" style={{background:"#FAEEDA", color:"#412402"}}>
            <p className="font-medium mb-1 text-[10px] opacity-70">💡 Idea</p>
            Migrate auth to OAuth 2.0 before launch
          </div>
          <div className="absolute top-16 left-52 w-40 p-3 rounded-xl text-xs leading-relaxed" style={{background:"#E1F5EE", color:"#04342C"}}>
            <p className="font-medium mb-1 text-[10px] opacity-70">🚩 Priority</p>
            Ship mobile beta by Aug 15
          </div>
          <div className="absolute top-16 left-96 w-40 p-3 rounded-xl text-xs leading-relaxed" style={{background:"#EEEDFE", color:"#26215C"}}>
            <p className="font-medium mb-1 text-[10px] opacity-70">❓ Question</p>
            Freemium tier at launch or gate behind Pro?
          </div>
          {/* Card */}
          <div className="absolute top-56 left-6 w-56 bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-xs">
            <p className="font-medium text-sm mb-3">✅ Launch Checklist</p>
            <div className="space-y-2 text-gray-500">
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">✓</span><span className="line-through">Finalise pricing page</span></div>
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">✓</span><span className="line-through">Confirm CDN config</span></div>
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full border border-gray-300"></span><span>Load test (10k users)</span></div>
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full border border-gray-300"></span><span>Legal review of ToS</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}