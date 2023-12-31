import { random, randomInRange, randomAngle, getRangeMax } from '../../../utils/math/math.utils';


export class Star {

  static INTENSITY_CHANGE_PER_FRAME = 0.05;

  static INTENSITY_CHANGE_CHANCE = 0.0125 / 4;

  static FRAMES_PER_SECOND = 60;

  static createGlowCanvas() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const { devicePixelRatio } = window;

    const radius = 100 * devicePixelRatio;

    // TODO: Using a smaller radius (e.g. 10) creates blurrier stars.

    canvas.width = radius * 2;
    canvas.height = radius * 2;

    // draw a big beefy gradient in the center of the dummy canvas
    const radialGradient = ctx.createRadialGradient(
      // Start circle:
      radius,
      radius,
      0,

      // End circle:
      radius,
      radius,
      radius,
    );

    // TODO: Add solid square/circle option?

    // TODO: Add glow hue option:
    /*
    radialGradient.addColorStop(0.025, 'rgba(255, 255, 255, 1)')
    radialGradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.2)')
    radialGradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.07)')
    radialGradient.addColorStop(1, 'transparent')
    */

    radialGradient.addColorStop(0.025, 'rgba(255, 255, 255, 1)');
    radialGradient.addColorStop(0.1, 'transparent');

    ctx.fillStyle = radialGradient;

    ctx.beginPath();

    ctx.arc(radius, radius, radius, 0, Math.PI * 2);

    ctx.fill();

    return canvas;
  }

  // Canvas:

  glowCanvas;

  // Orbit:

  orbitX = 0;

  orbitY = 0;

  orbitRadius = 0;

  // Star:

  radius = 0;

  alpha = 1;

  // Physics & Movement:

  angle = 0;

  angularSpeed = 0;

  scrollOffsetFactor = 0;

  constructor({
    glowCanvas,
    orbitX,
    orbitY,
    orbitRadiusRange,
    secondsToFullRotation,
  }) {
    // CTXs:
    this.glowCanvas = glowCanvas;

    // Orbit:
    this.orbitX = orbitX;
    this.orbitY = orbitY;
    this.orbitRadius = randomInRange(orbitRadiusRange);

    // Star:
    const radius = random(100, this.orbitRadius) / 10;

    this.radius = radius;
    this.alpha = random(2, 10) / 10;

    // Physics:
    this.angle = randomAngle();
    // TODO: This could be adjusted not to depend on the FPS:
    this.angularSpeed = randomAngle() / (Star.FRAMES_PER_SECOND * secondsToFullRotation);

    const maxOrbitRadius = getRangeMax(orbitRadiusRange);
    const maxRadius = maxOrbitRadius / 10;

    let scrollOffsetFactor = 1;

    if (radius < maxRadius / 4) {
      scrollOffsetFactor = 0;
    } else if (radius < maxRadius / 2) {
      scrollOffsetFactor = 0.1;
    }

    this.scrollOffsetFactor = scrollOffsetFactor;
  }

  draw(
    ctx,
    scrollOffsetY,
  ) {
    // Rotate around orbit:
    // const x = Math.sin(this.angle) * this.orbitRadius + this.orbitX
    // const y = Math.cos(this.angle) * this.orbitRadius + this.orbitY

    // Rotate around orbit with scroll momentum:
    const x = Math.sin(this.angle) * this.orbitRadius + this.orbitX;
    const y = Math.cos(this.angle) * this.orbitRadius + this.orbitY + this.scrollOffsetFactor * scrollOffsetY;

    // All in line:
    // const x = this.orbitRadius + this.orbitX
    // const y = this.orbitRadius + this.orbitY

    if (this.radius > 15) {
      const twinkle = Math.random();

      if (twinkle <= Star.INTENSITY_CHANGE_CHANCE && this.alpha > 0) {
        this.alpha -= Star.INTENSITY_CHANGE_PER_FRAME;
      } else if (twinkle <= 2 * Star.INTENSITY_CHANGE_CHANCE && this.alpha < 1) {
        this.alpha += Star.INTENSITY_CHANGE_PER_FRAME;
      }
    }

    ctx.globalAlpha = this.alpha;

    // Draw the cached glow canvas image
    ctx.drawImage(this.glowCanvas, x - this.radius, y - this.radius, this.radius * 2, this.radius * 2);

    this.angle += this.angularSpeed;
  }

}
