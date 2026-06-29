type DataNode = {
  id: string;
  x: number;
  y: number;
  color: "emerald" | "gold";
  label?: string;
};

const nodes: DataNode[] = [
  { id: "n1", x: 44, y: 12, color: "emerald" },
  { id: "n2", x: 58, y: 18, color: "gold", label: "SOPs" },
  { id: "n3", x: 42, y: 30, color: "gold", label: "Strain Data" },
  { id: "n4", x: 60, y: 38, color: "emerald" },
  { id: "n5", x: 43, y: 52, color: "emerald", label: "Agents" },
  { id: "n6", x: 59, y: 62, color: "gold" },
  { id: "n7", x: 45, y: 78, color: "gold" },
  { id: "n8", x: 58, y: 86, color: "emerald", label: "ROI" },
];

const cards = [
  { title: "AI Opportunity Map", value: "Top 5", className: "left-4 top-16" },
  { title: "Agent Readiness", value: "82%", className: "right-4 top-24" },
  { title: "SOP Intelligence", value: "Live", className: "left-5 top-52" },
  { title: "Workflow ROI", value: "High", className: "right-5 bottom-36" },
  { title: "Human Review Layer", value: "On", className: "left-8 bottom-24" },
];

const connections = [
  ["n1", "n2"],
  ["n2", "n3"],
  ["n3", "n4"],
  ["n4", "n5"],
  ["n5", "n6"],
  ["n6", "n7"],
  ["n7", "n8"],
  ["n2", "n5"],
  ["n3", "n6"],
];

function nodeById(id: string) {
  return nodes.find((node) => node.id === id)!;
}

function LeafGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 3} ${y - 4}) scale(0.24)`}>
      <path
        d="M12 0c-2 5-1 9 2 12-6-2-10-6-12-12 6 0 10 3 13 8 0-5 3-10 8-14 2 7-1 13-7 17 5-1 9 0 13 3-4 5-9 6-15 3v10h-3V17C6 20 1 19-4 14c5-3 10-4 15-2C5 8 3 2 5-5c4 4 7 8 7 13V0Z"
        fill="currentColor"
      />
    </g>
  );
}

export default function CannabisAICommandMatrix() {
  return (
    <div
      aria-hidden="true"
      className="command-matrix group relative mx-auto aspect-[0.9] w-full max-w-[520px] overflow-hidden rounded-lg border border-landing-green/30 bg-black/70 shadow-[0_0_90px_rgba(29,185,84,0.18)] transition duration-500 hover:-translate-y-1 hover:rotate-[0.35deg] hover:border-gold/35"
    >
      <div className="matrix-aurora absolute -inset-20" />
      <div className="matrix-grid absolute inset-0" />
      <div className="matrix-vignette absolute inset-0" />

      {Array.from({ length: 26 }).map((_, index) => (
        <span
          key={index}
          className="matrix-particle absolute rounded-full bg-landing-green"
          style={{
            left: `${5 + ((index * 17) % 88)}%`,
            top: `${7 + ((index * 29) % 84)}%`,
            animationDelay: `${index * 0.19}s`,
          }}
        />
      ))}

      <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-landing-green/30 bg-black/60 px-3 py-1.5 text-[10px] font-bold uppercase text-landing-green backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-landing-green shadow-[0_0_14px_rgba(29,185,84,0.9)]" />
        Live Cannabis AI Scan
      </div>

      <div className="absolute right-5 top-5 z-20 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[10px] font-bold uppercase text-gold backdrop-blur">
        Founder Sprint
      </div>

      <svg className="absolute inset-0 z-10 h-full w-full" viewBox="0 0 100 100" role="presentation">
        <defs>
          <filter id="matrixGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="matrixPath" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#1DB954" />
            <stop offset="48%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#1DB954" />
          </linearGradient>
        </defs>

        <path
          className="matrix-helix"
          d="M44 12 C64 24 28 34 58 48 C80 64 25 70 58 86"
          fill="none"
          stroke="url(#matrixPath)"
          strokeWidth="0.9"
          strokeLinecap="round"
          filter="url(#matrixGlow)"
        />
        <path
          className="matrix-helix matrix-helix-alt"
          d="M58 18 C28 30 70 42 43 52 C22 66 76 74 45 78"
          fill="none"
          stroke="url(#matrixPath)"
          strokeWidth="0.75"
          strokeLinecap="round"
          filter="url(#matrixGlow)"
        />

        {connections.map(([from, to]) => {
          const a = nodeById(from);
          const b = nodeById(to);
          return (
            <line
              key={`${from}-${to}`}
              className="matrix-line"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={a.color === "gold" ? "rgba(255,215,0,0.34)" : "rgba(29,185,84,0.34)"}
              strokeWidth="0.28"
            />
          );
        })}

        {nodes.map((node, index) => (
          <g key={node.id} className="matrix-node" style={{ animationDelay: `${index * 0.17}s` }}>
            {(index === 1 || index === 4 || index === 6) && (
              <>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="5.7"
                  fill="none"
                  stroke={node.color === "gold" ? "rgba(255,215,0,0.28)" : "rgba(29,185,84,0.28)"}
                  strokeWidth="0.35"
                />
                <circle
                  className="matrix-ring"
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill="none"
                  stroke={node.color === "gold" ? "rgba(255,215,0,0.34)" : "rgba(29,185,84,0.34)"}
                  strokeWidth="0.26"
                />
              </>
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r="3.2"
              fill="rgba(0,0,0,0.74)"
              stroke={node.color === "gold" ? "#FFD700" : "#1DB954"}
              strokeWidth="0.65"
              filter="url(#matrixGlow)"
            />
            <circle cx={node.x} cy={node.y} r="1.05" fill={node.color === "gold" ? "#FFD700" : "#1DB954"} />
            {index === 2 || index === 5 ? (
              <g className={node.color === "gold" ? "text-gold" : "text-landing-green"}>
                <LeafGlyph x={node.x} y={node.y} />
              </g>
            ) : null}
          </g>
        ))}
      </svg>

      <div className="matrix-scan-y absolute left-0 right-0 z-20 h-px" />
      <div className="matrix-scan-x absolute bottom-0 top-0 z-20 w-px" />

      {cards.map((card) => (
        <div
          key={card.title}
          className={`matrix-card absolute z-30 ${card.className} max-w-[155px] rounded-lg border border-white/10 bg-black/58 p-3 shadow-xl shadow-black/30 backdrop-blur-md`}
        >
          <p className="text-[9px] font-bold uppercase text-white/38">{card.title}</p>
          <p className="mt-1 text-sm font-bold text-white">{card.value}</p>
        </div>
      ))}

      <div className="matrix-report absolute bottom-5 right-5 z-30 w-[45%] min-w-[180px] rounded-lg border border-gold/20 bg-black/64 p-4 shadow-2xl shadow-black/40 backdrop-blur-md">
        <p className="text-[9px] font-bold uppercase text-gold">Mini Report Preview</p>
        <p className="mt-1 text-sm font-bold text-white">Opportunity Map</p>
        <div className="mt-3 space-y-2">
          {["Impact", "Readiness", "Risk"].map((item, index) => (
            <div key={item}>
              <div className="flex justify-between text-[9px] font-bold uppercase text-white/34">
                <span>{item}</span>
                <span>{index === 2 ? "Low" : "High"}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-landing-green to-gold"
                  style={{ width: `${index === 2 ? 38 : 78 - index * 12}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .command-matrix {
          --emerald: 29, 185, 84;
          --gold: 255, 215, 0;
          background:
            radial-gradient(circle at 50% 18%, rgba(var(--emerald), .22), transparent 38%),
            radial-gradient(circle at 82% 62%, rgba(var(--gold), .14), transparent 34%),
            linear-gradient(180deg, rgba(4,12,9,.96), rgba(0,0,0,.98));
          box-shadow:
            0 0 80px rgba(var(--emerald), .18),
            inset 0 0 60px rgba(var(--emerald), .07);
        }
        .matrix-aurora {
          background:
            radial-gradient(circle at 34% 28%, rgba(var(--emerald), .25), transparent 32%),
            radial-gradient(circle at 76% 66%, rgba(var(--gold), .16), transparent 34%);
          filter: blur(18px);
          animation: matrixAura 9s ease-in-out infinite;
        }
        .matrix-grid {
          background-image:
            linear-gradient(rgba(var(--emerald), .11) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--emerald), .09) 1px, transparent 1px);
          background-size: 28px 28px;
          animation: matrixGrid 18s linear infinite;
          opacity: .55;
        }
        .matrix-vignette {
          background:
            linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.72)),
            radial-gradient(circle at 50% 50%, transparent 34%, rgba(0,0,0,.58) 100%);
        }
        .matrix-particle {
          width: 3px;
          height: 3px;
          opacity: .32;
          box-shadow: 0 0 14px rgba(var(--emerald), .8);
          animation: matrixParticle 7s ease-in-out infinite;
        }
        .matrix-helix {
          stroke-dasharray: 9 8;
          animation: matrixDash 7s linear infinite;
        }
        .matrix-helix-alt {
          animation-direction: reverse;
          opacity: .75;
        }
        .matrix-line {
          stroke-dasharray: 2 2.6;
          animation: matrixDash 8s linear infinite;
        }
        .matrix-node {
          animation: matrixNode 3.8s ease-in-out infinite;
          transform-origin: center;
        }
        .matrix-ring {
          transform-origin: center;
          animation: matrixRing 3.2s ease-in-out infinite;
        }
        .matrix-scan-y {
          top: 0;
          background: linear-gradient(90deg, transparent, rgba(var(--emerald), .95), rgba(var(--gold), .95), transparent);
          filter: drop-shadow(0 0 13px rgba(var(--emerald), .88));
          animation: matrixScanY 5.2s ease-in-out infinite;
        }
        .matrix-scan-x {
          left: 50%;
          background: linear-gradient(180deg, transparent, rgba(var(--emerald), .55), transparent);
          filter: drop-shadow(0 0 10px rgba(var(--emerald), .7));
          animation: matrixScanX 7.5s ease-in-out infinite;
        }
        .matrix-card {
          animation: matrixFloat 6s ease-in-out infinite;
        }
        .matrix-card:nth-of-type(2n) {
          animation-delay: -2s;
        }
        .matrix-report {
          animation: matrixReport 6.8s ease-in-out infinite;
        }
        @keyframes matrixAura {
          0%, 100% { transform: translate3d(-2%, -1%, 0) scale(1); opacity: .72; }
          50% { transform: translate3d(2%, 2%, 0) scale(1.06); opacity: 1; }
        }
        @keyframes matrixGrid {
          from { background-position: 0 0; }
          to { background-position: 56px 56px; }
        }
        @keyframes matrixParticle {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: .18; }
          50% { transform: translate3d(12px, -16px, 0); opacity: .78; }
        }
        @keyframes matrixDash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -80; }
        }
        @keyframes matrixNode {
          0%, 100% { opacity: .72; }
          50% { opacity: 1; }
        }
        @keyframes matrixRing {
          0%, 100% { transform: scale(.92); opacity: .18; }
          50% { transform: scale(1.18); opacity: .8; }
        }
        @keyframes matrixScanY {
          0%, 100% { transform: translate3d(0, 72px, 0); opacity: .22; }
          50% { transform: translate3d(0, 365px, 0); opacity: 1; }
        }
        @keyframes matrixScanX {
          0%, 100% { transform: translate3d(-120px, 0, 0); opacity: .18; }
          50% { transform: translate3d(130px, 0, 0); opacity: .72; }
        }
        @keyframes matrixFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }
        @keyframes matrixReport {
          0%, 100% { transform: translate3d(0, 0, 0); filter: saturate(1); }
          50% { transform: translate3d(0, -6px, 0); filter: saturate(1.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          .command-matrix,
          .command-matrix *,
          .matrix-aurora,
          .matrix-grid,
          .matrix-particle,
          .matrix-helix,
          .matrix-line,
          .matrix-node,
          .matrix-ring,
          .matrix-scan-y,
          .matrix-scan-x,
          .matrix-card,
          .matrix-report {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
          .matrix-scan-y { top: 48%; opacity: .35; }
          .matrix-scan-x { left: 50%; opacity: .24; }
        }
      `}</style>
    </div>
  );
}
