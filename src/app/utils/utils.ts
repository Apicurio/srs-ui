function accessibleRouteChangeHandler() {
  return window.setTimeout(() => {
    const mainContainer = document.getElementById('primary-app-container');
    if (mainContainer) {
      mainContainer.focus();
    }
  }, 50);
}


const getModalAppendTo = (): HTMLElement | undefined => document.querySelector('#qs-content') as HTMLElement || document.body;

const MAX_SERVICE_REGISTRY_NAME_LENGTH = 50;
const MAX_SERVICE_REGISTRY_DESC_LENGTH = 255;

export {
  accessibleRouteChangeHandler,
  getModalAppendTo,
  MAX_SERVICE_REGISTRY_NAME_LENGTH,
  MAX_SERVICE_REGISTRY_DESC_LENGTH
};