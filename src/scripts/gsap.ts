// Shared GSAP setup: register plugins once and import from here, not from 'gsap' directly.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: 'expo.out', duration: 1.2 });

/** Media query for visitors who haven't asked for reduced motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
/** Media query for devices with a precise pointer (mouse / trackpad). */
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

export const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  root.querySelector<T>(selector);
export const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

export { gsap, ScrollTrigger, SplitText };
