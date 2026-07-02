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
  { title: "Workflow Found", value: "High Fit", className: "left-4 top-16" },
  { title: "Agent Blueprint", value: "Ready", className: "right-4 top-24" },
  { title: "SOP Intelligence", value: "Live", className: "left-5 top-52" },
  { title: "Build Ready", value: "30 Days", className: "right-5 bottom-36" },
  { title: "Human Review", value: "On", className: "left-8 bottom-24" },
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
      className="command-matrix group relative mx-auto aspect-[0.95] w-full max-w-[560px] overflow-hidden rounded-lg border border-landing-green/30 bg-black/70 shadow-[0_0_90px_rgba(29,185,84,0.18)] transition duration-500 hover:-translate-y-1 hover:rotate-[0.35deg] hover:border-gold/35"
    >
      <div className="matrix-aurora absolute -inset-20" />
      <div className="matrix-grid absolute inset-0" />
      <img
        src="/images/ai-strategy/cannabis-ai-dna-hero.png"
        alt=""
        className="matrix-dna-image absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        width={1778}
        height={1000}
      />
      <div className="matrix-bio-glass absolute inset-0" />
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

      <div className="absolute left-1/2 top-5 z-20 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-purple-400/45 bg-purple-950/38 px-5 py-2.5 text-[18px] font-black uppercase text-purple-100 shadow-[0_0_24px_rgba(168,85,247,0.48)] backdrop-blur sm:flex">
        <span>Workflow</span>
        <span className="text-purple-300 drop-shadow-[0_0_8px_rgba(216,180,254,0.9)]">→</span>
        <span>Agent</span>
        <span className="text-purple-300 drop-shadow-[0_0_8px_rgba(216,180,254,0.9)]">→</span>
        <span>ROI</span>
      </div>

      <div className="absolute right-5 top-5 z-20 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[10px] font-bold uppercase text-gold backdrop-blur">
        POS & Dispensary
      </div>

      <svg className="absolute inset-0 z-10 h-full w-full opacity-80" viewBox="0 0 100 100" role="presentation">
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
          d="M2 58 C24 35 42 79 62 52 C78 30 94 50 100 42"
          fill="none"
          stroke="url(#matrixPath)"
          strokeWidth="0.9"
          strokeLinecap="round"
          filter="url(#matrixGlow)"
        />
        <path
          className="matrix-helix matrix-helix-alt"
          d="M0 66 C18 82 32 38 52 58 C72 78 86 37 100 50"
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
      <div className="matrix-analysis-window absolute z-20 rounded-full border border-landing-green/28" />
      <div className="matrix-analysis-window matrix-analysis-window-two absolute z-20 rounded-full border border-gold/28" />
      <div className="matrix-dna-readout absolute left-[15%] top-[53%] z-20 h-px w-[70%]" />

      {cards.map((card) => (
        <div
          key={card.title}
          className={`matrix-card absolute z-30 ${card.className} max-w-[155px] rounded-lg border border-white/10 bg-black/58 p-3 shadow-xl shadow-black/30 backdrop-blur-md`}
        >
          <p className="text-[9px] font-bold uppercase text-white/38">{card.title}</p>
          {card.title === "Build Ready" ? (
            <p className="mt-1 flex items-center gap-1 text-sm font-bold text-landing-green drop-shadow-[0_0_10px_rgba(29,185,84,0.65)]">
              {card.value}
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 11.5 11.5 4M6 4h5.5v5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          ) : (
            <p className="mt-1 text-sm font-bold text-white">{card.value}</p>
          )}
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
        .matrix-dna-image {
          z-index: 1;
          opacity: .78;
          filter: saturate(1.15) contrast(1.05);
          transform: scale(1.04);
          transition: transform .7s ease, opacity .7s ease, filter .7s ease;
        }
        .command-matrix:hover .matrix-dna-image {
          transform: scale(1.075);
          opacity: .88;
          filter: saturate(1.28) contrast(1.1);
        }
        .matrix-bio-glass {
          z-index: 2;
          background:
            radial-gradient(circle at 52% 54%, rgba(var(--emerald), .04), transparent 28%),
            linear-gradient(90deg, rgba(0,0,0,.62), transparent 26%, transparent 72%, rgba(0,0,0,.68)),
            linear-gradient(180deg, rgba(0,0,0,.28), rgba(0,0,0,.1) 42%, rgba(0,0,0,.56));
          box-shadow: inset 0 0 70px rgba(0,0,0,.62);
        }
        .matrix-grid {
          z-index: 3;
          background-image:
            linear-gradient(rgba(var(--emerald), .11) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--emerald), .09) 1px, transparent 1px);
          background-size: 28px 28px;
          animation: matrixGrid 18s linear infinite;
          opacity: .34;
        }
        .matrix-vignette {
          z-index: 4;
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
          height: 72px;
          background:
            linear-gradient(180deg, transparent, rgba(var(--emerald), .15), transparent),
            linear-gradient(90deg, transparent, rgba(var(--emerald), .95), rgba(var(--gold), .95), transparent);
          filter: drop-shadow(0 0 18px rgba(var(--emerald), .88));
          mix-blend-mode: screen;
          animation: matrixScanY 5.2s ease-in-out infinite;
        }
        .matrix-scan-x {
          left: 50%;
          width: 84px;
          background:
            linear-gradient(90deg, transparent, rgba(var(--emerald), .12), transparent),
            linear-gradient(180deg, transparent, rgba(var(--emerald), .62), rgba(var(--gold), .32), transparent);
          filter: drop-shadow(0 0 14px rgba(var(--emerald), .78));
          mix-blend-mode: screen;
          animation: matrixScanX 7.5s ease-in-out infinite;
        }
        .matrix-analysis-window {
          left: 18%;
          top: 43%;
          width: 118px;
          height: 118px;
          box-shadow:
            0 0 35px rgba(var(--emerald), .18),
            inset 0 0 28px rgba(var(--emerald), .08);
          background:
            radial-gradient(circle, rgba(var(--emerald), .08), transparent 62%),
            conic-gradient(from 90deg, transparent, rgba(var(--emerald), .45), transparent 34%, rgba(var(--gold), .35), transparent 70%);
          animation: matrixAnalyzeRing 5.5s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .matrix-analysis-window-two {
          left: 62%;
          top: 44%;
          width: 134px;
          height: 134px;
          animation-delay: -2.1s;
        }
        .matrix-dna-readout {
          background: repeating-linear-gradient(90deg, rgba(var(--emerald), .9) 0 8px, transparent 8px 16px, rgba(var(--gold), .72) 16px 22px, transparent 22px 34px);
          filter: drop-shadow(0 0 11px rgba(var(--emerald), .72));
          transform-origin: left center;
          animation: matrixReadout 4.8s ease-in-out infinite;
          opacity: .74;
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
          0%, 100% { transform: translate3d(0, 28px, 0); opacity: .16; }
          50% { transform: translate3d(0, 390px, 0); opacity: 1; }
        }
        @keyframes matrixScanX {
          0%, 100% { transform: translate3d(-210px, 0, 0); opacity: .14; }
          50% { transform: translate3d(155px, 0, 0); opacity: .8; }
        }
        @keyframes matrixAnalyzeRing {
          0%, 100% { transform: scale(.82) rotate(0deg); opacity: .12; }
          45% { transform: scale(1.08) rotate(145deg); opacity: .78; }
          70% { transform: scale(.98) rotate(220deg); opacity: .32; }
        }
        @keyframes matrixReadout {
          0%, 100% { transform: scaleX(.2); opacity: .08; }
          45% { transform: scaleX(1); opacity: .78; }
          72% { transform: scaleX(.72); opacity: .28; }
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
