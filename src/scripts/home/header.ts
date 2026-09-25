// Header slides away while scrolling down and comes back on scroll up.
import { gsap, ScrollTrigger, $ } from '../gsap';

export function initHeader() {
  const header = $('[data-header]');
  if (!header) return;

  let hidden = false;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const shouldHide = self.direction === 1 && self.scroll() > 240;
      if (shouldHide === hidden) return;
      hidden = shouldHide;
      gsap.to(header, { yPercent: hidden ? -110 : 0, duration: 0.7, ease: 'power3.out', overwrite: true });
    },
  });
}
