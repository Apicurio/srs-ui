import { formatDistance } from 'date-fns';

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

enum ServiceRegistryStatus {
  Provisioning = 'provisioning',
  Available = 'available',
  Unavailable = 'unavailable'
}

const statusOptions = [
  { value: 'available', label: 'Ready' },
  { value: 'unavailable', label: 'Failed' },
  { value: 'provisioning', label: 'Creation in progress' }
];

const getFormattedDate = (date: string | Date, translatePostfix: string): string => {
  date = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(date, new Date()) + ' ' + translatePostfix;
};

export {
  accessibleRouteChangeHandler,
  getModalAppendTo,
  MAX_SERVICE_REGISTRY_NAME_LENGTH,
  MAX_SERVICE_REGISTRY_DESC_LENGTH,
  ServiceRegistryStatus,
  statusOptions,
  getFormattedDate
};