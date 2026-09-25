// Infinite marquee that speeds up, reverses and skews with scroll velocity.
import { gsap, ScrollTrigger, $, $$, MOTION_OK } from '../gsap';

export function initMarquee() {
  const track = $('[data-marquee]');
  if (!track) return;

  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    const items = $$('[data-marquee-item]', track);
    const wrap = gsap.utils.wrap(-50, 0);
    const setX = gsap.quickSetter(track, 'xPercent');
    const setSkew = gsap.quickSetter(items, 'skewX', 'deg');
    const state = { x: 0, speed: 1, skew: 0, direction: -1 };
    const baseSpeed = 0.025; // xPercent per frame at 60fps

    const tick = (_time: number, deltaTime: number) => {
      state.x += baseSpeed * state.speed * state.direction * (deltaTime / 16.67);
      setX(wrap(state.x));
      setSkew(state.skew);
    };
    gsap.ticker.add(tick);

    // Each scroll update kicks speed and skew up, then they ease back to rest.
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const velocity = self.getVelocity();
        state.direction = self.direction === 1 ? -1 : 1;
        gsap.fromTo(
          state,
          { speed: 1 + Math.min(Math.abs(velocity) / 250, 12), skew: gsap.utils.clamp(-12, 12, velocity / -300) },
          { speed: 1, skew: 0, duration: 1.2, ease: 'power2.out', overwrite: true },
        );
      },
    });

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
    };
  });
}
