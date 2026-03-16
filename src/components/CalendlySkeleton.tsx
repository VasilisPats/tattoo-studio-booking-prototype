import { motion } from "framer-motion";

const CalendlySkeleton = () => {
  return (
    <div className="w-full h-[600px] flex flex-col p-6 animate-pulse bg-secondary/10">
      {/* Calendar Header Mockup */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-6 w-32 bg-border/50 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-border/50 rounded" />
          <div className="h-8 w-8 bg-border/50 rounded" />
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <div key={i} className="h-4 bg-border/30 rounded text-center text-[10px] flex items-center justify-center text-muted-foreground/30">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Mockup */}
      <div className="grid grid-cols-7 gap-4 flex-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div 
            key={i} 
            className={`aspect-square bg-border/20 rounded-sm border border-border/5 ${i < 5 || i > 25 ? 'opacity-30' : ''}`} 
          />
        ))}
      </div>

      {/* Bottom text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="h-3 w-40 bg-border/40 rounded" />
        <div className="h-2 w-24 bg-border/20 rounded" />
      </div>

      {/* Loading overlay for better visual hint */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="text-xs uppercase tracking-[0.2em] text-primary/40 font-medium"
        >
          Loading available times...
        </motion.div>
      </div>
    </div>
  );
};

export default CalendlySkeleton;
