// Counter 000 → 100 while the hero image loads, then the panel wipes upward.
import type Lenis from 'lenis';
import { gsap, $, MOTION_OK } from '../gsap';

export function runPreloader(lenis: Lenis | null): Promise<void> {
  const el = $('[data-preloader]');
  if (!el || !matchMedia(MOTION_OK).matches) {
    el?.remove();
    return Promise.resolve();
  }

  const count = $('[data-preloader-count]', el)!;
  const bar = $('[data-preloader-bar]', el)!;
  const heroImg = $<HTMLImageElement>('[data-hero-img]');
  const timeout = new Promise((r) => setTimeout(r, 4000));
  const imageReady = Promise.race([heroImg?.decode().catch(() => {}), timeout]);

  lenis?.stop();

  return new Promise((resolve) => {
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        el.remove();
        lenis?.start();
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        count.textContent = String(Math.round(counter.value)).padStart(3, '0');
      },
    })
      .to(bar, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
      // Hold at 100 until the hero image is decoded, so it never pops in.
      .add(() => {
        tl.pause();
        imageReady.then(() => tl.resume());
      })
      .to(count, { yPercent: -105, duration: 0.8, ease: 'expo.in' })
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.3, ease: 'expo.inOut' }, '-=0.1')
      .add(() => resolve(), '-=0.75');
  });
}
