// Desktop: pin the section and scroll the cards sideways, with image parallax
// inside each card and a progress bar. Mobile: cards simply rise in.
import { gsap, $, $$, MOTION_OK } from '../gsap';

export function initListings() {
  const section = $('[data-listings]');
  const track = $('[data-listings-track]');
  if (!section || !track) return;

  const cards = $$('[data-card]', track);
  const bar = $('[data-listings-bar]', section);
  const count = $('[data-listings-count]', section);

  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 900px)', motion: MOTION_OK }, (ctx) => {
    const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
    if (!motion) return;

    if (!desktop) {
      cards.forEach((card) =>
        gsap.from(card, { y: 60, autoAlpha: 0, scrollTrigger: { trigger: card, start: 'top 90%', once: true } }),
      );
      return;
    }

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const scroll = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          if (bar) gsap.set(bar, { scaleX: self.progress });
          if (count) {
            const index = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
            count.textContent = String(index).padStart(2, '0');
          }
        },
      },
    });

    // Image drifts inside its frame as the card travels across the screen.
    cards.forEach((card) => {
      const img = $('[data-card-img]', card);
      gsap.fromTo(
        img,
        { xPercent: -7 },
        {
          xPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
        },
      );
    });

    // Cards rise in, staggered, as the section arrives.
    gsap.from(cards, {
      y: 120,
      autoAlpha: 0,
      duration: 1.4,
      stagger: 0.08,
      scrollTrigger: { trigger: section, start: 'top 75%', once: true },
    });
  });
}
