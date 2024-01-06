// eslint-disable-next-line import/no-extraneous-dependencies
import Stats from 'stats.js';

import { Star } from '../star/star.class';
import { clamp } from '../../../utils/math/math.utils';

export class Galaxy {

  canvas = null;

  canvasDimensionsElement = document.querySelector('.app__canvasDimensions');

  ctx = null;

  width = 0;

  height = 0;

  // TODO: Maybe make it some kind of start density that depends on the screen size:
  maxStars = 2500;

  stars = [];

  requestAnimationFrameID = 0;

  resizeTimeoutID = 0;

  speedY = 0;

  maxSpeed = 225;

  scrollBufferRange = [5, 25];

  stats = new Stats();

  constructor(canvas) {
    // TODO: Configure maxStars

    this.tick = this.tick.bind(this);

    this.init(canvas);
  }

  init(canvas) {
    // 1. Get canvas and CTX:
    this.canvas = canvas;

    this.ctx = canvas.getContext('2d');

    // 2. Update dimensions:
    this.updateDimensions();

    // 3. Instantiate all stars:
    this.createStars();

    // 4. Automatically star the animation:
    this.start();

    // Add FPS meter:

    const { stats } = this;

    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

    document.body.appendChild(stats.dom);
  }

  updateDimensions() {
    const { canvas, canvasDimensionsElement } = this;

    if (!canvas) return false;

    const {
      width: prevWidth,
      height: prevHeight,
    } = this;

    canvas.width = this.width = canvasDimensionsElement.clientWidth;
    canvas.height = this.height = canvasDimensionsElement.clientHeight;

    // Keep the size of the canvas unchanged when resizing the window (until this
    // function is called again and it updates these values again):
    canvas.style.width = `${ this.width }px`;
    canvas.style.height = `${ this.height }px`;

    return this.width !== prevWidth || this.ehgith !== prevHeight;
  }

  createStars() {
    // Instantiate cached gradient for the stars glow effect:
    const glowCanvas = Star.createGlowCanvas();

    if (!glowCanvas) return;

    // Instantiate all stars:
    const maxDimension = Math.max(this.width, this.height);
    const hypotenuse = Math.round(Math.sqrt(2 * (maxDimension ** 2)));
    const orbitRadiusRange = [0, hypotenuse / 2];

    for (let i = 0; i < this.maxStars; ++i) {
      this.stars[i] = new Star({
        glowCanvas,
        orbitX: this.width / 2,
        orbitY: this.height / 2,
        orbitRadiusRange,
        secondsToFullRotation: 60 * 5,
      });
    }
  }

  resizeCanvas(stopAnimation = false) {
    if (stopAnimation) this.stop();

    window.clearTimeout(this.resizeTimeoutID);

    this.resizeTimeoutID = window.setTimeout(() => {
      const hasViewportResized = this.updateDimensions();

      if (!hasViewportResized) return;

      if (!stopAnimation) this.stop();

      this.createStars();
      this.start();
    }, 250);
  }

  start() {
    this.canvas.style.opacity = '1';

    this.tick();
  }

  stop(hideCanvas = false) {
    cancelAnimationFrame(this.requestAnimationFrameID);

    if (hideCanvas && this.canvas) {
      // TODO: Configurable style OR class:
      // TODO: Also revert when we start again:
      this.canvas.style.opacity = '0';
    }
  }

  tick() {
    const {
      ctx, width, height, stars, stats,
    } = this;

    if (!ctx) return;

    stats.begin();

    ctx.clearRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'transparent';

    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'lighter';

    const absSpeedY = Math.abs(this.speedY);

    if (absSpeedY <= 0.01) {
      this.speedY = 0;
    } else {
      const halfSpeed = this.maxSpeed / 2;

      let quadFactor = 0.99;

      if (absSpeedY >= halfSpeed) {
        // absSpeedY = halfSpeed => factor = 0
        // - quadFactor stays the same = 0.99
        // - less momentum (re-center slow)

        // absSpeedY = maxSpeed  => factor = 1
        // - quadFactor becomes smaller = 0.985
        // - strong momentum (re-center fast)

        const factor = clamp((absSpeedY - halfSpeed) / halfSpeed, 0, 1);

        quadFactor -= 0.01 * factor;
      }

      this.speedY *= quadFactor;
    }

    for (let i = 0; i < stars.length; ++i) {
      stars[i].draw(
        ctx,
        this.speedY,
      );
    }

    stats.end();

    this.requestAnimationFrameID = requestAnimationFrame(this.tick);
  }

  updatePhysics({
    accelerateY,
  }) {
    if (accelerateY !== undefined) {
      const factor = clamp(
        Math.abs(this.speedY),
        this.scrollBufferRange[0],
        this.scrollBufferRange[1],
      ) / this.scrollBufferRange[1];

      this.speedY = clamp(this.speedY + factor * accelerateY, -this.maxSpeed, this.maxSpeed);
    }
  }

}
