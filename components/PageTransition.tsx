"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
export default function PageTransition() { const pathname = usePathname(); return <AnimatePresence mode="wait"><motion.div aria-hidden className="page-transition" key={pathname} initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} exit={{ scaleY: 1 }} transition={{ duration: .85, ease: [.22,1,.36,1] }} /></AnimatePresence>; }
