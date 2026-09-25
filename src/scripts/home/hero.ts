// Hero: masked character reveal + image curtain on load, then on scroll the
// image grows to full-bleed while the headline drifts up.
import { gsap, SplitText, $, $$, MOTION_OK } from '../gsap';

/** Returns the paused intro timeline; index.ts plays it when the preloader lifts. */
export function initHero(): gsap.core.Timeline | null {
  const title = $('[data-hero-title]');
  const media = $('[data-hero-media]');
  const reveal = $('[data-hero-reveal]');
  const parallax = $('[data-hero-parallax]');
  const img = $('[data-hero-img]');
  const fades = $$('[data-hero-fade]');
  if (!title || !media || !reveal || !parallax || !img) return null;

  if (!matchMedia(MOTION_OK).matches) return null;

  const split = SplitText.create($$('.hero__line', title), {
    type: 'lines,chars',
    mask: 'lines',
    linesClass: 'split-line',
  });

  const intro = gsap.timeline({ paused: true });
  intro
    .set([title, reveal], { autoAlpha: 1 })
    .from(split.chars, { yPercent: 115, rotate: 6, duration: 1.5, stagger: 0.022 })
    .fromTo(
      reveal,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' },
      0.15,
    )
    .from(img, { scale: 1.45, duration: 2.4 }, 0.35)
    .from(fades, { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1.2 }, 0.9)
    .from('[data-header]', { yPercent: -110, duration: 1.2 }, 0.6);

  // Scroll: inset card → full-bleed, image parallax, headline drifts up.
  const pad = () => parseFloat(getComputedStyle(title.parentElement!).paddingLeft);
  gsap.fromTo(
    media,
    { clipPath: () => `inset(0px ${pad()}px 0px ${pad()}px round 20px)` },
    {
      clipPath: 'inset(0px 0px 0px 0px round 0px)',
      ease: 'none',
      scrollTrigger: { trigger: media, start: 'top 85%', end: 'top top', scrub: true, invalidateOnRefresh: true },
    },
  );
  gsap.fromTo(
    parallax,
    { yPercent: -10 },
    { yPercent: 0, ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true } },
  );
  gsap.to(title, {
    yPercent: -25,
    ease: 'none',
    scrollTrigger: { trigger: title, start: 'top top+=100', end: 'bottom top', scrub: true },
  });

  return intro;
}
