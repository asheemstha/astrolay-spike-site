// Generic scroll reveals driven by data attributes, so new sections can opt in from markup:
//   data-split-lines   heading lines rise out of a mask
//   data-fade-up       element fades and rises in
//   data-speed="0.5"   parallax (positive = slower than scroll, negative = faster)
//   data-scrub-text    words brighten one by one as you scroll through
//   data-spin          rotates with scroll
import { gsap, SplitText, $, $$, MOTION_OK } from '../gsap';

export function initReveals() {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    splitLines();
    fadeUp();
    parallax();
    scrubText();
    spin();
    darkPanel();
    advisors();
    wordmark();
  });
}

function splitLines() {
  $$('[data-split-lines]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.3,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
    });
  });
}

function fadeUp() {
  $$('[data-fade-up]').forEach((el) => {
    gsap.from(el, { y: 50, autoAlpha: 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
}

function parallax() {
  $$('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed ?? '0');
    const distance = () => speed * window.innerHeight * 0.2;
    gsap.fromTo(
      el,
      { y: () => distance() },
      {
        y: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      },
    );
  });
}

function scrubText() {
  $$('[data-scrub-text]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words' });
    gsap.fromTo(
      split.words,
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 40%', scrub: true },
      },
    );
  });
}

function spin() {
  $$('[data-spin]').forEach((el) => {
    gsap.to(el, { rotation: 720, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.5 } });
  });
}

/** The dark block opens out from an inset card as it scrolls into view. */
function darkPanel() {
  const panel = $('[data-dark]');
  if (!panel) return;
  gsap.fromTo(
    panel,
    { clipPath: 'inset(0% 3% 0% 3% round 32px)' },
    {
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      ease: 'none',
      scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 20%', scrub: true },
    },
  );
}

function advisors() {
  $$('[data-advisor]').forEach((card, i) => {
    const media = $('[data-advisor-media]', card);
    const img = $('[data-advisor-img]', card);
    const text = $$('h3, p', card);
    const tl = gsap.timeline({
      delay: (i % 4) * 0.12,
      scrollTrigger: { trigger: card, start: 'top 85%', once: true },
    });
    tl.fromTo(media, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
      .from(img, { scale: 1.35, duration: 1.8 }, 0.1)
      .from(text, { y: 20, autoAlpha: 0, stagger: 0.08 }, 0.6);
  });
}

function wordmark() {
  const el = $('[data-wordmark]');
  if (!el) return;
  gsap.from(el.children, {
    yPercent: 100,
    duration: 1.6,
    stagger: 0.07,
    scrollTrigger: { trigger: el, start: 'top 95%', once: true },
  });
}
