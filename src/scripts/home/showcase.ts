// Showcase: pinned image that opens from a small card to full screen, then the
// testimonial writes itself in word by word.
import { gsap, SplitText, $, MOTION_OK } from '../gsap';

export function initShowcase() {
  const section = $('[data-showcase]');
  const frame = $('[data-showcase-frame]');
  const img = $('[data-showcase-img]');
  const quote = $('[data-showcase-quote]');
  const cite = $('[data-showcase-cite]');
  if (!section || !frame || !img || !quote) return;

  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    const split = SplitText.create(quote, { type: 'words', mask: 'words' });

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, start: 'top top', end: '+=160%', pin: true, scrub: 1 },
      })
      .fromTo(
        frame,
        { clipPath: 'inset(22% 24% 22% 24% round 24px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 },
      )
      .fromTo(img, { scale: 1.5 }, { scale: 1, duration: 1.2 }, 0)
      .from(split.words, { yPercent: 100, stagger: 0.03, duration: 0.3, ease: 'power2.out' }, 0.8)
      .from(cite, { autoAlpha: 0, y: 20, duration: 0.3 }, '>-0.1');
  });
}
