"use client";
import Lenis from "lenis";
import { useEffect } from "react";
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) { useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const lenis=new Lenis({lerp:.08,wheelMultiplier:.85});let raf=0;const frame=(time:number)=>{lenis.raf(time);raf=requestAnimationFrame(frame);};raf=requestAnimationFrame(frame);return()=>{cancelAnimationFrame(raf);lenis.destroy();};},[]);return children; }
