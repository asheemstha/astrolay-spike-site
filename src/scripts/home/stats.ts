// Stats: divider draws in, number counts up, label and note fade in.
import { gsap, $, $$, MOTION_OK } from '../gsap';

export function initStats() {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    $$('[data-stat-row]').forEach((row) => {
      const line = $('[data-stat-line]', row);
      const num = $('[data-count]', row);
      if (!num) return;

      const target = Number(num.dataset.count);
      const decimals = Number(num.dataset.decimals ?? 0);
      const prefix = num.dataset.prefix ?? '';
      const suffix = num.dataset.suffix ?? '';
      const format = (v: number) =>
        prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

      const counter = { value: 0 };
      num.textContent = format(0);

      gsap
        .timeline({ scrollTrigger: { trigger: row, start: 'top 85%', once: true } })
        .from(line, { scaleX: 0, duration: 1.4, ease: 'expo.inOut' })
        .to(counter, { value: target, duration: 2.2, onUpdate: () => (num.textContent = format(counter.value)) }, 0.2)
        .from($$('[data-stat-fade]', row), { y: 30, autoAlpha: 0, stagger: 0.1 }, 0.4);
    });
  });
}
