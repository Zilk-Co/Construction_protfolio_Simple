import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AnimatedBackground() {
  const isMobile = useIsMobile();
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Theme-aware base layer */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated gradient blobs */}
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[120px] will-change-transform"
      />
      
      {!isMobile && (
        <>
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 80, 0],
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
            className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-accent/15 blur-[150px] will-change-transform"
          />

          <motion.div
            animate={{
              x: [0, 120, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
              delay: 5,
            }}
            className="absolute -bottom-[30%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-blue-600/10 blur-[130px] will-change-transform"
          />
        </>
      )}

      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
