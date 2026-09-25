// Homepage entry: wires every animation module together in order.
import { ScrollTrigger } from '../gsap';
import { initSmoothScroll } from '../smooth-scroll';
import { runPreloader } from './preloader';
import { initHero } from './hero';
import { initHeader } from './header';
import { initPointer } from './pointer';
import { initReveals } from './reveals';
import { initMarquee } from './marquee';
import { initListings } from './listings';
import { initStats } from './stats';
import { initServices } from './services';
import { initShowcase } from './showcase';
import { initFooter } from './footer';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

async function init() {
  // SplitText measures lines, so wait for the web fonts first.
  await document.fonts.ready;

  const lenis = initSmoothScroll();
  const heroIntro = initHero();

  initHeader();
  initPointer();
  initReveals();
  initMarquee();
  initListings();
  initStats();
  initServices();
  initShowcase();
  initFooter();

  // Triggers were created per module, not in page order; sort so the pinned
  // sections' extra scroll length is accounted for in everything below them.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();

  await runPreloader(lenis);
  heroIntro?.play();
}

init();
