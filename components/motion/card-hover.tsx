"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CardHoverProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Lift-on-hover treatment for summary and customer cards.
 *
 * Adds a 2px translate plus a softer shadow on hover. Reduced-motion users
 * get the static state thanks to the global animation-duration override.
 */
export function CardHover({ children, className }: CardHoverProps) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "var(--shadow-soft)" }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
