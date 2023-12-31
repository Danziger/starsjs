import { IS_DESKTOP, HAS_CURSOR } from '../../constants/browser.constants';
import { Galaxy } from '../galaxy/galaxy/galaxy.class';
import { initializeLinks } from '../link/link.utils';
import { sleep } from '../../utils/promises/promises.utils';

export class App {

  // CSS classes:
  static C_HAS_ACTIVE_FOCUS = 'app--hasActiveFocus';
  static C_HAS_ACTIVE_HOVER = 'app--hasActiveHover';
  static C_SHOW_FALLBACK = 'app--showFallback';
  static C_SHOW_SCREENSHOT = 'app--showScreenshot';
  static C_LOADING = 'app--isLoading';
  static C_INITIALIZED = 'app--isInitialized';

  // CSS selectors:
  static S_CANVAS = '.app__canvas';

  // Elements:
  root = document.body;
  canvas = document.querySelector(App.S_CANVAS);

  // Scroll effect:
  // TODO: Move this into galaxy.class.js:

  prevScrollTop = 0;
  prevScrollTime = 0;
  prevDirection = 'down';
  deltaSum = 0;
  timeoutID = 0;

  // State:
  isInitialized = false;

  // Components:
  galaxy = null;

  constructor() {
    const { root } = this;

    let focusActive = false;

    if (IS_DESKTOP) {
      const disableFocus = () => {
        focusActive = false;
        root.classList.remove(App.C_HAS_ACTIVE_FOCUS);
      };

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !focusActive) {
          focusActive = true;
          root.classList.add(App.C_HAS_ACTIVE_FOCUS);
        } else if (e.key === 'Escape' && focusActive) {
          disableFocus();
        }
      });

      document.addEventListener('mousedown', disableFocus);
      document.addEventListener('touchstart', disableFocus);
    }

    initializeLinks();

    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);

    this.init();
  }

  async init() {
    if (HAS_CURSOR) {
      // TODO: Should the addition or removal of this be triggered from within Cursor?
      this.root.classList.add(App.C_HAS_ACTIVE_HOVER);
    }

    await sleep(3000);

    this.galaxy = new Galaxy(this.canvas);

    this.isInitialized = true;

    this.root.classList.add(App.C_LOADING);

    await sleep(3000);

    this.root.classList.add(App.C_INITIALIZED);
    this.root.classList.remove(App.C_LOADING);
  }

  handleResize() {
    if (!this.isInitialized) return;

    this.galaxy.resizeCanvas();
  }

  handleScroll() {
    if (!this.isInitialized) return;

    window.clearTimeout(this.timeoutID);

    this.timeoutID = window.setTimeout(() => {
      this.deltaSum = 0;
    }, 50);

    const { scrollTop } = document.documentElement;
    const now = Date.now();

    const delta = scrollTop - this.prevScrollTop;
    const deltaTime = now - this.prevScrollTime;
    const direction = delta < 0 ? 'up' : 'down';

    if (direction === this.prevDirection) {
      this.deltaSum += Math.abs(delta);
    } else {
      this.deltaSum = 0;
    }

    this.prevScrollTop = scrollTop;
    this.prevScrollTime = now;
    this.prevDirection = direction;

    this.galaxy.updatePhysics({
      accelerateY: (direction === 'up' ? 1 : -1) * (delta / deltaTime) ** 2,
    });

  }

  enableScreenshotMode() {
    this.root.classList.add(App.C_SHOW_SCREENSHOT);
  }

  disableScreenshotMode() {
    this.root.classList.remove(App.C_SHOW_SCREENSHOT);
  }

}
