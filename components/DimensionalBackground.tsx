
export default function DimensionalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0B0909]">
      {/* Ambient Lighting Layer */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#B5B9F0] opacity-10 blur-[150px] animate-drift-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2E4540] opacity-15 blur-[150px] animate-drift" />
        <div className="absolute top-[40%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-[#1a2420] opacity-20 blur-[150px] animate-drift-mid" />
      </div>

      {/* Noise Texture Layer */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      <style jsx>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.05); }
        }
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-5%, -2%) scale(1); }
        }
        @keyframes drift-mid {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, -3%) scale(1.02); }
        }
        .animate-drift { animation: drift 30s infinite ease-in-out; }
        .animate-drift-slow { animation: drift-slow 40s infinite ease-in-out; }
        .animate-drift-mid { animation: drift-mid 35s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
