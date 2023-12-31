export const HAS_TOUCH = navigator.maxTouchPoints > 0
  || 'ontouchstart' in window
  || (window.DocumentTouch && document instanceof window.DocumentTouch);

export const IS_DESKTOP
  = !navigator.userAgentData?.mobile;
  // = !/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

let hasCursor = false;

try {
  hasCursor = IS_DESKTOP && !window.matchMedia('(hover: none)').matches;
} catch (err) {
  hasCursor = !HAS_TOUCH;
}

export const HAS_CURSOR = hasCursor;
