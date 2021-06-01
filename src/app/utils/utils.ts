function accessibleRouteChangeHandler() {
  return window.setTimeout(() => {
    const mainContainer = document.getElementById('primary-app-container');
    if (mainContainer) {
      mainContainer.focus();
    }
  }, 50);
}


const getModalAppendTo = (): HTMLElement | undefined => document.querySelector('#qs-content') as HTMLElement || document.body;

export {
  accessibleRouteChangeHandler,
  getModalAppendTo
};