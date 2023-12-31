import { App } from './components/app/app.component';

// eslint-disable-next-line no-console
console.log('Hello there 👋. Wanna play a game? 👉 https://danziger.github.io/slotjs/');

const app = new App();

window.enableScreenshotMode = () => app.enableScreenshotMode();

window.disableScreenshotMode = () => app.disableScreenshotMode();

window.v = () => {
  const buildDate = new Date(process.env.BUILD_DATE);

  return `${ buildDate.toDateString() } at ${ buildDate.toLocaleTimeString() } | ${ process.env.COMMIT_HASH }`;
};

// SERVICE WORKER:

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (process.env.DEV) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        // eslint-disable-next-line no-console
        console.log(`Unregistering all ${ registrations.length } ServiceWorkers`);

        registrations.forEach((registration) => registration.unregister());
      });

      return;
    }

    navigator.serviceWorker.register('/service-worker.js');
  });
}
