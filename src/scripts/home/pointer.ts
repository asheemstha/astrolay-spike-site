// Custom cursor + magnetic buttons. Mouse/trackpad only.
import { gsap, $, $$, MOTION_OK, FINE_POINTER } from '../gsap';

export function initPointer() {
  const mm = gsap.matchMedia();
  mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
    const cleanups = [initCursor(), ...initMagnetic()];
    return () => cleanups.forEach((fn) => fn?.());
  });
}

function initCursor() {
  const cursor = $('[data-cursor]');
  const label = $('[data-cursor-label]');
  if (!cursor || !label) return;

  gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' });
  let shown = false;

  const size = (px: number) => gsap.to(cursor, { width: px, height: px, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });

  const onMove = (e: PointerEvent) => {
    if (!shown) {
      shown = true;
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      gsap.to(cursor, { autoAlpha: 1, duration: 0.3 });
    }
    xTo(e.clientX);
    yTo(e.clientY);
  };

  const onOver = (e: PointerEvent) => {
    const target = e.target as Element;
    const labelled = target.closest<HTMLElement>('[data-cursor-label]');
    if (labelled) {
      label.textContent = labelled.dataset.cursorLabel ?? '';
      cursor.classList.add('is-label');
      size(96);
    } else if (target.closest('a, button, input, select, label')) {
      cursor.classList.remove('is-label');
      size(48);
    } else {
      cursor.classList.remove('is-label');
      size(12);
    }
  };

  const onLeave = () => {
    shown = false;
    gsap.to(cursor, { autoAlpha: 0, duration: 0.3 });
  };

  window.addEventListener('pointermove', onMove);
  document.addEventListener('pointerover', onOver);
  document.documentElement.addEventListener('pointerleave', onLeave);

  return () => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    document.documentElement.removeEventListener('pointerleave', onLeave);
  };
}

/** Elements with [data-magnetic] lean toward the pointer and spring back. */
function initMagnetic() {
  return $$('[data-magnetic]').map((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const strength = 0.35;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  });
}
