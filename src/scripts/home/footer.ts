// Footer: parallax lift as it arrives, plus the newsletter form.
// The form has no backend yet — it only validates and shows a confirmation.
import { gsap, $, MOTION_OK } from '../gsap';

export function initFooter() {
  const footer = $('[data-footer]');
  const inner = $('[data-footer-inner]');

  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    if (!footer || !inner) return;
    gsap.from(inner, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top top', scrub: true },
    });
  });

  const form = $<HTMLFormElement>('[data-newsletter]');
  const status = $('[data-newsletter-status]');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    if (status) status.textContent = 'Thanks — you’re on the list.';
  });
}
