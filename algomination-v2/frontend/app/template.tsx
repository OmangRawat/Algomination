"use client";

import { motion } from "framer-motion";

/**
 * A `template` re-mounts on every navigation (unlike `layout`), so this gives
 * each page a subtle fade/slide-in transition.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
