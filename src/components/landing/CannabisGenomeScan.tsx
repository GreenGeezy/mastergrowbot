const labels = [
  { text: "Cultivation Data", className: "left-4 top-10" },
  { text: "SOPs", className: "right-6 top-24" },
  { text: "Strain Intelligence", className: "left-2 top-48" },
  { text: "Workflow Agents", className: "right-4 bottom-28" },
  { text: "AI Opportunity Map", className: "left-8 bottom-12" },
];

const nodes = Array.from({ length: 9 }, (_, index) => {
  const y = 54 + index * 42;
  const phase = index % 2 === 0 ? 0 : 1;
  return {
    y,
    leftX: phase ? 173 : 117,
    rightX: phase ? 117 : 173,
    leaf: index === 1 || index === 4 || index === 7,
  };
});

function LeafMark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 8} ${y - 9}) scale(0.5)`}>
      <path
        d="M16 3c-4 5-5 9-2 13-6-1-9-5-10-10 5 0 9 2 12 7 1-5 4-9 9-12 1 6-2 11-8 14 4-1 8 0 12 2-3 4-8 6-13 3v9h-2v-9C8 23 3 21 0 17c5-2 9-2 14-1C8 13 5 8 6 2c5 3 8 7 9 12 1-4 1-8 1-11Z"
        fill="rgba(29,185,84,0.92)"
      />
    </g>
  );
}

export default function CannabisGenomeScan() {
  const linePointsLeft = nodes.map((node) => `${node.leftX},${node.y}`).join(" ");
  const linePointsRight = nodes.map((node) => `${node.rightX},${node.y}`).join(" ");

  return (
    <div
      aria-hidden="true"
      className="genome-scan group relative mx-auto aspect-[0.86] w-full max-w-[430px] overflow-hidden rounded-lg border border-landing-green/24 bg-black/50 shadow-2xl shadow-landing-green/10 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:rotate-[0.6deg] hover:border-gold/35"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(29,185,84,0.24),transparent_35%),radial-gradient(circle_at_50%_72%,rgba(255,215,0,0.1),transparent_36%)]" />
      <div className="genome-grid absolute inset-0 opacity-55" />
      <div className="genome-particles absolute inset-0">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-landing-green/70"
            style={{
              left: `${8 + ((index * 23) % 86)}%`,
              top: `${8 + ((index * 31) % 82)}%`,
              animationDelay: `${index * 0.32}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[10px] font-bold uppercase text-white/58">
        Live Strategy Scan
      </div>
      <div className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-landing-green shadow-[0_0_18px_rgba(29,185,84,0.9)]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 450" role="presentation">
        <defs>
          <filter id="genomeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="helixGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1DB954" />
            <stop offset="48%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#1DB954" />
          </linearGradient>
        </defs>

        <polyline
          points={linePointsLeft}
          fill="none"
          stroke="url(#helixGradient)"
          strokeLinecap="round"
          strokeWidth="2"
          opacity="0.78"
          filter="url(#genomeGlow)"
        />
        <polyline
          points={linePointsRight}
          fill="none"
          stroke="url(#helixGradient)"
          strokeLinecap="round"
          strokeWidth="2"
          opacity="0.78"
          filter="url(#genomeGlow)"
        />

        {nodes.map((node, index) => (
          <g key={node.y}>
            <line
              x1={node.leftX}
              x2={node.rightX}
              y1={node.y}
              y2={node.y}
              stroke={index % 2 ? "rgba(255,215,0,0.55)" : "rgba(29,185,84,0.6)"}
              strokeWidth="1"
              strokeDasharray="4 7"
            />
            {[node.leftX, node.rightX].map((x, nodeIndex) => (
              <g key={`${node.y}-${x}`}>
                <circle
                  cx={x}
                  cy={node.y}
                  r="15"
                  fill="rgba(0,0,0,0.72)"
                  stroke={nodeIndex ? "#FFD700" : "#1DB954"}
                  strokeWidth="1.4"
                  filter="url(#genomeGlow)"
                />
                <circle cx={x} cy={node.y} r="4" fill={nodeIndex ? "#FFD700" : "#1DB954"} />
                {node.leaf && nodeIndex === index % 2 && <LeafMark x={x} y={node.y} />}
              </g>
            ))}
          </g>
        ))}
      </svg>

      <div className="genome-scan-beam absolute left-0 right-0 top-0 h-20 bg-gradient-to-b from-transparent via-landing-green/24 to-transparent" />

      {labels.map((label) => (
        <span
          key={label.text}
          className={`genome-label absolute ${label.className} rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-bold uppercase text-white/64 shadow-lg shadow-black/30 backdrop-blur`}
        >
          {label.text}
        </span>
      ))}

      <div className="absolute inset-x-5 bottom-5 rounded-lg border border-white/[0.08] bg-black/55 p-4 backdrop-blur">
        <p className="text-[10px] font-bold uppercase text-gold">Opportunity Signal</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="genome-progress h-full rounded-full bg-gradient-to-r from-landing-green via-gold to-landing-green" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-semibold uppercase text-white/42">
          <span>Impact</span>
          <span>Readiness</span>
          <span>Risk</span>
        </div>
      </div>

      <style>{`
        .genome-grid {
          background-image:
            linear-gradient(rgba(29,185,84,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29,185,84,0.1) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .genome-particles span {
          animation: genomeParticle 8s ease-in-out infinite;
          transform: translate3d(0, 0, 0);
        }
        .genome-scan-beam {
          animation: genomeBeam 6.5s ease-in-out infinite;
          transform: translate3d(0, -90px, 0);
        }
        .genome-label {
          animation: genomeFloat 6s ease-in-out infinite;
        }
        .genome-label:nth-of-type(2n) {
          animation-delay: -2.5s;
        }
        .genome-progress {
          animation: genomeProgress 4.8s ease-in-out infinite;
          transform-origin: left center;
        }
        @keyframes genomeBeam {
          0%, 100% { transform: translate3d(0, -90px, 0); opacity: 0; }
          15%, 80% { opacity: 1; }
          50% { transform: translate3d(0, 280px, 0); opacity: 0.95; }
        }
        @keyframes genomeParticle {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.22; }
          50% { transform: translate3d(10px, -14px, 0); opacity: 0.82; }
        }
        @keyframes genomeFloat {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.72; }
          50% { transform: translate3d(0, -8px, 0); opacity: 1; }
        }
        @keyframes genomeProgress {
          0%, 100% { transform: scaleX(0.38); filter: saturate(1); }
          50% { transform: scaleX(0.88); filter: saturate(1.35); }
        }
        @media (prefers-reduced-motion: reduce) {
          .genome-scan,
          .genome-scan *,
          .genome-particles span,
          .genome-scan-beam,
          .genome-label,
          .genome-progress {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
          .genome-scan-beam {
            opacity: 0.22;
            top: 44%;
          }
        }
      `}</style>
    </div>
  );
}
