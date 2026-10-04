
export default function AnimatedGradientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0B0909]">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#B5B9F0] opacity-15 blur-[120px] animate-drift" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2E4540] opacity-20 blur-[120px] animate-drift-slow" />
      
      <style jsx>{`
        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20%, 20%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift-slow {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-20%, -10%) scale(1); }
          100% { transform: translate(0, 0) scale(1.1); }
        }
        .animate-drift { animation: drift 25s infinite ease-in-out; }
        .animate-drift-slow { animation: drift-slow 20s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
