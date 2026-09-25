// Services: rows draw in on scroll; on desktop a floating image preview follows
// the pointer and swaps to the hovered service, tilting with pointer speed.
import { gsap, ScrollTrigger, $, $$, MOTION_OK, FINE_POINTER } from '../gsap';

export function initServices() {
  const list = $('[data-services-list]');
  const preview = $('[data-service-preview]');
  if (!list) return;

  const rows = $$('[data-service]', list);
  const mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    rows.forEach((row) => {
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: 'top 90%', once: true } })
        .from($('[data-service-line]', row), { scaleX: 0, duration: 1.4, ease: 'expo.inOut' })
        .from(row.children, { y: 40, autoAlpha: 0, stagger: 0.06 }, 0.2);
    });
  });

  if (!preview) return;
  // Fixed-position preview lives on <body> so no transformed ancestor can offset it.
  document.body.appendChild(preview);
  const images = $$('[data-service-img]', preview);

  mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
    gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
    const xTo = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3' });
    const rotateTo = gsap.quickTo(preview, 'rotation', { duration: 0.8, ease: 'power3' });
    let lastX = 0;

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rotateTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    const onEnter = (e: PointerEvent) => {
      gsap.set(preview, { x: e.clientX, y: e.clientY });
      lastX = e.clientX;
      gsap.to(preview, { scale: 1, autoAlpha: 1, duration: 0.6, overwrite: 'auto' });
    };
    const onLeave = () => {
      gsap.to(preview, { scale: 0.6, autoAlpha: 0, duration: 0.5, overwrite: 'auto' });
      rotateTo(0);
    };

    const rowHandlers = rows.map((row, i) => {
      const show = () =>
        images.forEach((img, j) =>
          gsap.to(img, { autoAlpha: i === j ? 1 : 0, scale: i === j ? 1 : 1.2, duration: 0.7, overwrite: 'auto' }),
        );
      row.addEventListener('pointerenter', show);
      return () => row.removeEventListener('pointerenter', show);
    });

    list.addEventListener('pointermove', onMove);
    list.addEventListener('pointerenter', onEnter);
    list.addEventListener('pointerleave', onLeave);

    // Scrolling can carry the list out from under a still pointer without a pointerleave.
    const scrollGuard = ScrollTrigger.create({ trigger: list, onLeave, onLeaveBack: onLeave });

    return () => {
      scrollGuard.kill();
      list.removeEventListener('pointermove', onMove);
      list.removeEventListener('pointerenter', onEnter);
      list.removeEventListener('pointerleave', onLeave);
      rowHandlers.forEach((off) => off());
    };
  });
}
