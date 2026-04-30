"use client";

import { motion } from "motion/react";
import { Children } from "react";

interface PageRevealProps {
  children: React.ReactNode;
  /** Stagger between successive children, in seconds. */
  stagger?: number;
  /** Per-child duration, in seconds. */
  duration?: number;
}

/**
 * Wraps the main content slot with a staggered fade+rise reveal animation.
 *
 * Each direct child becomes its own animated section — sections fade in
 * from 8px below their final position, with a 40ms cascade. The animation
 * collapses to instant render under `prefers-reduced-motion` thanks to the
 * global CSS reset in `app/globals.css`.
 */
export function PageReveal({
  children,
  stagger = 0.04,
  duration = 0.24,
}: PageRevealProps) {
  const items = Children.toArray(children);
  return (
    <>
      {items.map((child, index) => (
        <motion.div
          // The key uses index because list ordering is stable for a given
          // page render and the underlying elements are not reordered.
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: index * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
