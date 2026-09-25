// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, MOTION_OK } from './gsap';

export function initSmoothScroll(): Lenis | null {
  if (!matchMedia(MOTION_OK).matches) return null;

  const lenis = new Lenis({ lerp: 0.09, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
