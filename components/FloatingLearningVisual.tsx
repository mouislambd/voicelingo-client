import { motion } from "framer-motion";

export default function FloatingLearningVisual() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <motion.div
        animate={{
          rotateY: [0, 360],
          y: [0, -20, 0],
        }}
        transition={{
          rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="w-16 h-16 bg-[#B5B9F0] rounded-2xl shadow-lg shadow-[#B5B9F0]/50 flex items-center justify-center border-2 border-white/20"
      >
        <span className="text-3xl">💡</span>
      </motion.div>
    </div>
  );
}
